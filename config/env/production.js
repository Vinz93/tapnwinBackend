export default {
  env: 'production',
  host: 'https://52.37.117.104',
  path: '/',
  basePath: '/tapnwin/api/v2',
  port: 8080,
  db: 'mongodb://localhost/tapnwin',
  mailer: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'techludopia@gmail.com',
      pass: '12ludotech34',
    },
  },
  times: {
    recovery: 0.5,
    update: 0.5,
    expired: 24,
  },
};
