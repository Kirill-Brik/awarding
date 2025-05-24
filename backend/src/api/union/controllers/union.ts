require('dotenv').config();
import {factories} from '@strapi/strapi';
import utils from "@strapi/utils";


const validation = require('../validation');

const {ValidationError} = utils.errors

// Функция отправки подтверждения по email
async function sendMailConfirmUnion(ctx, url, type, unionUser, unionId) {
  try {
    console.log('Отправка подтверждения по email начата');
    const confirmUrl = createConfirmUrl(url, type, unionId, unionUser);
    const header = createHeader(unionUser);
    await strapi
      .plugin('email-designer')
      .service('email')
      .sendTemplatedEmail(
        {
          to: ctx.request.body.data.guest_data.email,
          from: 'info@vtb.family',
        },
        {
          // required - Ref ID defined in the template designer (won't change on import)
          templateReferenceId: 1,
        },
        {
          initiator: ctx.state.user,
          header: header,
          confirm_url: confirmUrl.href,
        }
      )

    console.log('Подтверждение по email успешно отправлено');
  } catch (error) {
    console.log(error)
    return ctx.badRequest('Не удалось отправить приглашение для вступления в союз')
  }
}

function createConfirmUrl(baseUrl, type, unionId, unionUser) {
  const url = new URL(baseUrl);
  url.searchParams.set('auth', type);
  url.searchParams.set('id', unionId);
  url.searchParams.set('email', unionUser.email);
  url.searchParams.set('surname', unionUser.surname);
  url.searchParams.set('first_name', unionUser.first_name);
  url.searchParams.set('middle_name', unionUser.middle_name);
  url.searchParams.set('gender', unionUser.gender);
  return url;
}

function createHeader(guestData) {
  let header = guestData.gender === 'male' ? 'Уважаемый' : 'Уважаемая'
  header = header + ` ${guestData.surname} ${guestData.first_name} ${guestData.middle_name}!`
  return header
}

export default factories.createCoreController('api::union.union', ({strapi}) => ({
  async create(ctx) {
    try {
      console.log('Создание связи начато');
      if (!ctx.request.body.data || !ctx.request.body.data.guest_data)
        return ctx.badRequest('Необходимы данные связи')
      if (!ctx.state.user)
        return ctx.forbidden('авторизуйтесь для создания связи')
      const {guest_data} = ctx.request.body.data;
      ctx.request.body.data.initiator = ctx.state.user.id;
      await validation.validateCreateUnion(guest_data, ctx.state.user)
      const unionUser = await findUnionUser(guest_data.email);
      if (unionUser && unionUser.gender === ctx.state.user.gender)
        return ctx.badRequest('У найденного пользователя такой же пол, как у вас')
      ctx.request.body.data.union_user = unionUser ? unionUser.id : null;
      console.log('Валидация данных гостя пройдена');
      const result = await super.create(ctx);
      console.log('Связь успешно создана');
      await sendMailConfirmUnion(
        ctx,
        process.env.FRONT_URL,
        unionUser ? 'auth' : 'register',
        ctx.request.body.data.guest_data,
        result.data.id,
      );
      console.log('Завершение создания связи');
      return result;
    } catch (error) {
      console.error('Ошибка при создании связи:', error);
      throw error;
    }
  },

  async findOne(ctx) {
    try {
      console.log('Поиск связи по ID начат');
      const union = await strapi.entityService.findOne('api::union.union', ctx.params.id, {
        populate: {union_user: true, initiator: true, guest_data: true},
      });

      if (ctx.state.user.email === union.guest_data.email || ctx.state.user.id === union.initiator.id) {
        console.log('Связь найдена и доступ разрешен');
        return union;
      } else {
        console.warn('Нет доступа для получения данных о связи');
        return ctx.forbidden('Нет доступа для получения данных о связи');
      }
    } catch (error) {
      console.error('Ошибка при поиске связи:', error);
      return ctx.internalServerError('Произошла ошибка при поиске связи');
    }
  },

  async find(ctx) {
    try {
      console.log('Поиск всех связей начат');
      return await strapi.entityService.findMany('api::union.union', {
        populate: {initiator: {populate: {avatar: true}}, union_user: {populate: {avatar: true}}, guest_data: true},
        filters: {
          $or: [
            // @ts-ignore
            {initiator: ctx.state.user.id},
            {union_user: ctx.state.user.id},
            {guest_data: {email: ctx.state.user.email}}
          ],
        },
        sort: {
          createdAt: 'desc',
        }
      });
    } catch (error) {
      console.error('Ошибка при поиске всех связей:', error);
      return ctx.internalServerError('Произошла ошибка при поиске всех связей');
    }
  },

  async confirm(ctx) {
    try {
      console.log('Подтверждение связи начато');
      if (!ctx.request.body.data || !ctx.request.body.data.status)
        return ctx.badRequest('Необходимы данные связи');
      const union = await strapi.entityService.findOne('api::union.union', ctx.params.id, {
        populate: {initiator: true, union_user: true, guest_data: true},
      });
      if (!union) {
        console.warn('Связь не найдена');
        return ctx.badRequest('Связь не найдена');
      }
      if (ctx.state.user.email === union.guest_data.email) {
        ctx.request.body.data.union_user = ctx.state.user.id;
        ctx.request.body.data.confirm_date = new Date();
      } else {
        console.warn('Нет доступа для подтверждения связи');
        return ctx.forbidden('Нет доступа для подтверждения связи');
      }
      if (union.initiator.gender === ctx.state.user.gender && ctx.request.body.data.status === 'confirm')
        return ctx.badRequest('Нельзя подтвердить связь между пользователями одного пола', {type: 'forbidden gender'});

      console.log('Связь успешно подтверждена');
      return await super.update(ctx);
    } catch (error) {
      console.error('Ошибка при подтверждении связи:', error);
      return ctx.internalServerError('Произошла ошибка при подтверждении связи');
    }
  },

  async sign(ctx) {
    try {
      console.log('Подписание связи начато');
      const union = await strapi.entityService.findOne('api::union.union', ctx.params.id, {
        populate: {union_user: true, initiator: true},
      });
      if (!union) {
        console.warn('Связь не найдена');
        return ctx.badRequest('Связь не найдена');
      }
      if (union.transaction_hash) {
        console.warn('Связь уже подписана');
        return ctx.badRequest('Связь уже подписана');
      }
      if (union.status !== 'confirm') {
        console.warn('Связь не подтверждена');
        return ctx.badRequest('Связь не подтверждена');
      }
      if (union.initiator.email !== ctx.state.user.email && union.union_user.email !== ctx.state.user.email) {
        console.warn('Нет доступа для подписи связи в blockchain');
        return ctx.forbidden('Нет доступа для подписи связи в blockchain');
      }

      const contract: any = await strapi.entityService.findMany('api::contract.contract');
      if (contract && !contract.address) {
        return ctx.notFound('Не найден адрес контракта для обновления');
      }
      const hash = await signUnion(contract.address, union)
      ctx.request.body.data = {
        contract: contract.address,
        transaction_hash: hash,
        confirm_date: new Date()
      };
      console.log('Связь успешно подписана');
      return await super.update(ctx);
    } catch (error) {
      console.error('Ошибка при подписании связи:', error);
      return ctx.internalServerError('Произошла ошибка при подписании связи', {message: error.message});
    }
  }
}));

// Поиск пользователя union
async function findUnionUser(email) {
  console.log('Поиск пользователя union');
  return await strapi.db.query('plugin::users-permissions.user').findOne({
    where: {email},
  });
}

// Подписание union
async function signUnion(contractAddress, union) {
  console.log('Подписание union');
  return await strapi.service('api::union.union').signUnion(contractAddress, {
    id: union.id,
    initiator_id: union.initiator.id,
    user_id: union.union_user.id,
    union_type: union.union_type,
  });
}
