export default {
  env: 'testing',
  host: process.env.TAPNWIN_HOST || 'http://127.0.0.1',
  path: '/',
  basePath: '/tapnwin/test',
  port: 4040,
  basePort: 4040,
  db: 'mongodb://localhost/tapnwin_test',
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
