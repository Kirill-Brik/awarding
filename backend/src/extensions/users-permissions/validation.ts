import '@strapi/strapi';
import utils from "@strapi/utils";

const {yup, validateYupSchema} = utils
const {ValidationError} = utils.errors

function formatUser(body, allowedFields) {
  const newBody = {}
  allowedFields.forEach(key => {
    if (body[key]) newBody[key] = body[key]
  });
  const userSchema = yup.object({
    date_of_birth: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string()
      else return yup.date()
        .transform((value) => isNaN(new Date(value).valueOf()) ? null : value)
    }),
    phone: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string()
      else return yup.number().nullable()
        .transform((value) => {
          value = value.toString().replace(/\D/g, '')
          if (value.startsWith('7')) value = '8' + value.slice(1)
          if (value.startsWith('9')) value = '8' + value
          return isNaN(value) ? null : Number(value)
        })
    }),
  })
  return userSchema.cast(newBody)
}

async function validateCallback(body) {
  const userSchema = yup.object({
    identifier: yup.string().required('Email обязателен к заполнению'),
    password: yup.string().required('Пароль обязателен к заполнению'),
  })
  await validateYupSchema(userSchema)(body)
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: {
      provider: 'local',
      $or: [{email: body.identifier.toLowerCase()}, {username: body.identifier}],
    },
  });
  if (!user) {
    throw new ValidationError('Неверный пользователь или пароль');
  }

  if (!user.password) {
    throw new ValidationError('Неверный пользователь или пароль');
  }

  const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(
    body.password,
    user.password
  );

  if (!validPassword) {
    throw new ValidationError('Неверный пользователь или пароль');
  }
}

async function validateAvatar(file) {
  const avatarSchema = yup.object({
    type: yup.string().required().matches(/^image\/(png|jpg|jpeg|gif|webp)$/, 'Неподходящий формат'),
    size: yup.number().required()
      .test('is-max-10mb', 'Файл не должен превышать 10MB', (value) => value / 1024 / 1024 < 10)
  }).typeError('Аватар должен быть валидный')
    .test('is-file', 'Автар должен быть валидный', (value) => value.constructor.name === 'File')
  await validateYupSchema(avatarSchema)(file)
}

async function validateRegister(body) {
  const userSchema = yup.object().shape({
    email: yup.string().required('Email обязателен к заполнению').email('Email должен быть валидный')
      .test('is-Cyrillic', 'Email должен быть валидный', (value: string) => !/^(?=.*[а-яА-Я]).*$/g.test(value)),
    password: yup.string().required('Пароль обязателен к заполнению')
      .min(8, 'Пароль должен быть длинной минимум ${min} символов')
      .test('is-valid', () =>
          'В состав пароля обязательно должны входить: ' +
          'одна цифра; ' +
          'один спец. символ; ' +
          'одна строчная буква; ' +
          'одна прописная буква; ',
        (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()—_+=;:,.\/?\\|`~\[\]{} ]).*$/g.test(value)),
    surname: yup.string().required('Фамилия обязательна к заполнению'),
    first_name: yup.string().required('Имя обязательно к заполнению'),
    middle_name: yup.string(),
    date_of_birth: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string().required('Дата рождения обязательна к заполнению')
      else return yup.date().nullable()
        .typeError('Дата рождения должна быть валидной')
        .required('Дата рождения должна быть валидной')
        .max(new Date(), 'Дата рождения должна быть валидной')
    }),
    phone: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string().required('Телефон обязателен к заполнению')
      else return yup.number().nullable()
        .typeError('Телефон должен быть валидный')
        .required('Телефон должен быть валидный')
        .integer('Телефон должен быть валидный')
        .test('is-format', 'Неверный формат телефона', (value: number) => value.toString().startsWith('89'))
        .test('is-length', 'Телефон должен быть длинной 11 символов', (value: number) => value.toString().length === 11)
    }),
    gender: yup.string().required('Пол обязателен к заполнению')
      .oneOf(['male', 'female'], 'Пол должен быть валидным'),
  })
  await validateYupSchema(userSchema)(body)
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: {
      provider: 'local',
      $or: [{email: body.email.toLowerCase()}, {username: body.identifier}],
    },
  });
  if (user) {
    throw new ValidationError('Пользователь с этим email уже существует');
  }
}

async function validateUpdate(body, user) {
  const userSchema = yup.object({
    surname: yup.string(),
    first_name: yup.string(),
    middle_name: yup.string(),
    date_of_birth: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string()
      else return yup.date().nullable()
        .typeError('Дата рождения должна быть валидной')
        .required('Дата рождения должна быть валидной')
        .max(new Date(), 'Дата рождения должна быть валидной')
    }),
    phone: yup.lazy((value) => {
      if (value === '' || value === undefined)
        return yup.string()
      else return yup.number().nullable()
        .typeError('Телефон должен быть валидный')
        .required('Телефон должен быть валидный')
        .integer('Телефон должен быть валидный')
        .test('is-format', 'Неверный формат телефона', (value: number) => value.toString().startsWith('89'))
        .test('is-length', 'Телефон должен быть длинной 11 символов', (value: number) => value.toString().length === 11)
    }),
    gender: yup.string().oneOf(['male', 'female'], 'Пол должен быть валидным')
  })
  await validateYupSchema(userSchema)(body)
  if (body.gender && user.gender !== body.gender) {
    const union = await strapi.db.query('api::union.union').findOne({
      where: {$or: [{$and: [{initiator: user.id}, {status: 'confirm'}]}, {$and: [{guest_data: {email: user.email}}, {status: 'confirm'}]}]}
    });
    if (union) {
      throw new ValidationError('Нельзя менять пол так как у вас уже имеется связь');
    }
  }
}

async function validateChangePassword(body) {
  const changePasswordSchema = yup
    .object({
      password: yup.string().required('Поле пароль является обязательным')
        .test('is-valid', () =>
            'В состав пароля обязательно должны входить: ' +
            'одна цифра; ' +
            'один спец. символ; ' +
            'одна строчная буква; ' +
            'одна прописная буква; ',
          (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()—_+=;:,.\/?\\|`~\[\]{} ]).*$/g.test(value)),
      passwordConfirmation: yup
        .string()
        .required('Поле подтверждение пароля является обязательным')
        .oneOf([yup.ref('password')], 'Пароли не совпадают'),
      currentPassword: yup.string().required('Поле текущий пароль является обязательным'),
    })
    .noUnknown();
  await validateYupSchema(changePasswordSchema)(body)
}

async function validateForgotPassword(body) {
  const forgotPasswordSchema = yup
    .object({
      email: yup.string().email('Email должен быть валидный').required('Email обязателен к заполнению')
        .test('is-Cyrillic', 'Email должен быть валидный', (value: string) => !/^(?=.*[а-яА-Я]).*$/g.test(value)),
    })
    .noUnknown();
  await validateYupSchema(forgotPasswordSchema)(body)
}

async function validateResetPassword(body) {
  const resetPasswordSchema = yup
    .object({
      password: yup.string().required('Пароль обязателен к заполнению')
        .test('is-valid', () =>
            'В состав пароля обязательно должны входить: ' +
            'одна цифра; ' +
            'один спец. символ; ' +
            'одна строчная буква; ' +
            'одна прописная буква; ',
          (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()—_+=;:,.\/?\\|`~\[\]{} ]).*$/g.test(value)),
      passwordConfirmation: yup.string().required('Подтвержение пароля обязательно к заполнению'),
      code: yup.string().required('Код обязателен к заполнению'),
    })
    .noUnknown();
  await validateYupSchema(resetPasswordSchema)(body)
}

module.exports = {
  formatUser,
  validateCallback,
  validateRegister,
  validateUpdate,
  validateAvatar,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword
};
