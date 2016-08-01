export default {
  env: 'production',
  host: 'https://52.37.117.104',
  path: '/',
  basePath: '/tapnwin/api/v1',
  port: 3000,
  db: process.env.TAPNWIN_PROD_DB || 'mongodb://localhost/tapnwin',
  mailer: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'portalasig.prueba@gmail.com',
      pass: 'supersecret',
    },
  },
  times: {
    recovery: 1800000,
    update: 1800000,
  },
};
