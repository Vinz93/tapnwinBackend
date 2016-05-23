'use strict';

module.exports = {
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
};
