export default {
  env: 'development',
  port: 3000,
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
