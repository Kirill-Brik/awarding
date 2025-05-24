import '@strapi/strapi';
import utils from "@strapi/utils";

const {yup, validateYupSchema} = utils
const {ValidationError} = utils.errors

async function validateCreateUnion(guestData, user) {
  const userSchema = yup.object({
    surname: yup.string().required('Фамилия обязательна к заполнению'),
    first_name: yup.string().required('Имя обязательно к заполнению'),
    middle_name: yup.string(),
    email: yup.string().required('Email обязателен к заполнению').email('Email должен быть валидный')
      .test('is-Cyrillic', 'Email должен быть валидный', (value: string) => !/^(?=.*[а-яА-Я]).*$/g.test(value)),
    gender:  yup.string().required('Пол обязателен к заполнению')
      .oneOf(['male', 'female'], 'Пол должен быть валидным')
      .test('is-opposite', 'Пол должен быть противоположен вашему', (value) =>user.gender !== value),
  })
  await validateYupSchema(userSchema)(guestData)
  const union = await strapi.db.query('api::union.union').findOne({ where: { guest_data: { email: guestData.email }, initiator: user.id } });
  if (union) {
    throw new ValidationError('Связь с этим пользователем уже создана');
  }
}

module.exports = {validateCreateUnion};
