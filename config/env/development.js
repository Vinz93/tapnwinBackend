export default {
  env: 'development',
  host: process.env.TAPNWIN_DEV_HOST || 'http://127.0.0.1',
  path: '/',
  basePath: '/',
  port: 3000,
  basePort: 3000,
  db: 'mongodb://localhost/tapnwin_dev',
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
