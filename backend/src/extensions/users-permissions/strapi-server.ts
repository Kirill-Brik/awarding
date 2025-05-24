import '@strapi/strapi';

const validation = require('./validation');

// Получение текущего аватара пользователя
async function getCurrentAvatar(ctx) {
  try {
    const populateUser = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, {
      fields: [],
      populate: 'avatar'
    });
    return populateUser.avatar;
  } catch (error) {
    console.error("Ошибка при получении текущего аватара: ", error);
    throw error;
  }
}

// Удаление аватара
async function removeAvatar(avatar) {
  try {
    return await strapi.plugins.upload.services.upload.remove(avatar);
  } catch (error) {
    console.error("Ошибка при удалении аватара: ", error);
    throw error;
  }
}

// Загрузка аватара
async function uploadAvatar(name, avatar) {
  try {
    const createdFiles = await strapi.plugins.upload.services.upload.upload({
      data: {
        fileInfo: {
          name: name,
          caption: name,
          alternativeText: name,
        },
      },
      files: avatar,
    });
    return createdFiles[0];
  } catch (error) {
    console.error("Ошибка при загрузке аватара: ", error);
    throw error;
  }
}


module.exports = (plugin) => {
  const existingAuthControllers = plugin.controllers.auth;
  const existingUserControllers = plugin.controllers.user;

  const AuthControllers = {
    // Переопределенный callback
    async callback(ctx) {
      try {
        await validation.validateCallback(ctx.request.body);
        return await existingAuthControllers.callback(ctx);
      } catch (error) {
        console.error("Ошибка в callback: ", error);
        throw error;
      }
    },
    async register(ctx) {
      try {
        const allowedFields = ['email', 'surname', 'first_name', 'middle_name', 'phone', 'gender', 'date_of_birth', 'about', 'init_invite', 'avatar', 'password'];
        const {files} = ctx.request;
        const body = validation.formatUser(ctx.request.body, allowedFields)
        await validation.validateRegister(body)
        ctx.request.body.username = body.username = body.email;
        ctx.request.body.date_of_birth = new Date(body.date_of_birth);
        if (files && files.avatar) {
          await validation.validateAvatar(files.avatar)
          ctx.request.body.avatar = await uploadAvatar(body.username, files.avatar);
        } else if (body.avatar) {
          await validation.validateAvatar(body.avatar)
          ctx.request.body.avatar = await uploadAvatar(body.username, body.avatar);
        }
        return await existingAuthControllers.register(ctx);
      } catch (error) {
        console.error("Ошибка в register: ", error);
        throw error;
      }
    },
    async changePassword(ctx) {
      try {
        if (!ctx.state.user) {
          return await ctx.badRequest('Вы должны пройти аутентификацию, чтобы сбросить пароль');
        }
        const user = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          ctx.state.user.id
        );
        await validation.validateChangePassword(ctx.request.body);
        const {currentPassword, password} = ctx.request.body;
        const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(currentPassword, user.password);
        if (!validPassword) {
          return await ctx.badRequest('Текущий пароль не действителен');
        }

        if (currentPassword === password) {
          return await ctx.badRequest('Ваш новый пароль должен отличаться от текущего пароля');
        }
        return await existingAuthControllers.changePassword(ctx);
      } catch (error) {
        console.error("Ошибка в changePassword: ", error);
        throw error;
      }
    },
    async forgotPassword(ctx) {
      try {
        await validation.validateForgotPassword(ctx.request.body);
        const user = await strapi
          .query('plugin::users-permissions.user')
          .findOne({where: {email: ctx.request.body.email.toLowerCase()}});

        if (!user || user.blocked) {
          return ctx.send({ok: true});
        }
        return await existingAuthControllers.forgotPassword(ctx);
      } catch (error) {
        console.error("Ошибка в forgotPassword: ", error);
        throw error;
      }
    },
    async resetPassword(ctx) {
      try {
        await validation.validateResetPassword(ctx.request.body);
        const {body} = ctx.request;
        if (body.password !== body.passwordConfirmation) {
          return await ctx.badRequest('Пароли не совпадают');
        }

        const user = await strapi
          .query('plugin::users-permissions.user')
          .findOne({where: {resetPasswordToken: body.code}});

        if (!user) {
          return await ctx.badRequest('Код некоректный');
        }
        return await existingAuthControllers.resetPassword(ctx);
      } catch (error) {
        console.error("Ошибка в resetPassword: ", error);
        throw error;
      }
    }
  };

  const UserControllers = {
    async me(ctx) {
      try {
        ctx.request.query = {populate: {avatar: true, init_invite: true}};
        return await existingUserControllers.me(ctx);
      } catch (error) {
        console.error("Ошибка в me: ", error);
        throw error;
      }
    },
    async update(ctx) {
      try {
        const allowedFields = ['surname', 'middle_name', 'first_name', 'phone', 'gender', 'date_of_birth', 'about', 'init_invite', 'avatar'];
        const {files} = ctx.request;
        const body = validation.formatUser(ctx.request.body, allowedFields)
        await validation.validateUpdate(body, ctx.state.user)
        if (body.date_of_birth) body.date_of_birth = new Date(body.date_of_birth);
        if (files && files.avatar || body.avatar) {
          await validation.validateAvatar(body.avatar || files.avatar)
          const currentAvatar = await getCurrentAvatar(ctx);
          if (currentAvatar) await removeAvatar(currentAvatar);
          body.avatar = await uploadAvatar(ctx.state.user.username, body.avatar || files.avatar);
        }
        if (body.init_invite) {
          const union = await strapi.entityService.findOne('api::union.union', body.init_invite, {
            populate: {guest_data: true, union_user: true}
          });
          if (union) {
            if (union.guest_data.email !== ctx.state.user.email) {
              delete body.init_invite
              // return ctx.forbidden('Нет доступа для получения данных о связи');
            } else if (!union.union_user || union.union_user.id !== ctx.params.id) {
              // @ts-ignore
              await strapi.entityService.update('api::union.union', union.id, {data: {union_user: ctx.params.id}});
            }
          }
        }
        console.log(body)
        ctx.request.body = body
        return await existingUserControllers.update(ctx);
      } catch (error) {
        console.error("Ошибка в update: ", error);
        throw error;
      }
    }
  };

  plugin.controllers.auth = {
    ...existingAuthControllers,
    ...AuthControllers,
  };
  plugin.controllers.user = {
    ...existingUserControllers,
    ...UserControllers,
  }

  return plugin;
}
;
