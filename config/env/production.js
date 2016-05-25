export default {
  env: 'production',
  port: 3000,
  db: process.env.TAPNWIN_PROD_URL,
  mailer: {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
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
