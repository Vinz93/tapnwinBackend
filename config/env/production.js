export default {
  env: 'production',
  host: 'https://52.39.109.204',
  path: '/',
  basePath: '/tapnwin/api/v1',
  port: 8080,
  db: 'mongodb://localhost/tapnwin',
  mailer: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'registro@tapandwin.today',
      pass: 'vinotinto2016',
    },
  },
  times: {
    recovery: 0.5,
    update: 0.5,
    expired: 24,
  },
};
