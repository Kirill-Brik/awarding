export default ({env}) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ['avatar', 'phone', 'gender', 'date_of_birth', 'first_name', 'surname', 'middle_name']
      },
    }
  },
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        plugins: ["users-permissions"],
      },
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-smtp',
      providerOptions: {
        host: 'smtp.mail.ru', //SMTP Host
        port: 465, //SMTP Port
        secure: true,
        username: 'info@vtb.family',
        password: 'pY3HgiKrghxXhsqJpcbH',
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 2000,
      },
    },
    settings: {
      defaultFrom: 'info@vtb.family',
      defaultReplyTo: 'kirill.brik@yandex.ru',
    },
  },
});
