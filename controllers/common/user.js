'use strict';

require('../../models/common/user');

const path = require('path');
const mongoose = require('mongoose');
const EmailTemplate = require('email-templates').EmailTemplate;

const User = mongoose.model('User');

module.exports = {
  read(req, res) {
    User.findById(req.params.user_id)
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.json(user);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    User.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(users => res.json(users))
    .catch(err => res.status(500).send(err));
  },
  create(req, res) {
    User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
  createPwdToken(req, res) {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      const mailer = req.app.locals.mailer;
      const template = path.join(req.app.locals.config.root, '/views/mail/password_recovery');
      const send = mailer.templateSender(new EmailTemplate(template));

      user.pwdToken = user.generateToken();

      user.save()
      .then(() => {
        send({
          to: 'a.alvarez.sor@gmail.com',
          subject: 'Password recovery',
        }, {
          user,
        }, err => {
          if (err)
            return res.status(500).send(err);

          res.status(201).end();
        });
      })
      .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
  },
  update(req, res) {
    User.findByIdAndUpdate(req.params.user_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    }).catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
  delete(req, res) {
    User.findByIdAndRemove(req.params.user_id)
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    }).catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};
