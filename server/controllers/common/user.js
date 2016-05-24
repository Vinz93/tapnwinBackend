/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import User from '../../models/common/user';

import path from 'path';
import templates from 'email-templates';

const EmailTemplate = templates.EmailTemplate;

const UserController = {
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
  readMe(req, res) {
    res.json(res.locals.user);
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
  createRecoveryToken(req, res) {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      const locals = req.app.locals;
      const mailer = locals.mailer;
      const template = path.join(locals.config.root, '/server/views/mail/password_recovery');
      const send = mailer.templateSender(new EmailTemplate(template));

      user.recoveryToken = user.generateToken();

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
  updateMe(req, res) {
    const user = res.locals.user;

    delete req.body.password;

    Object.assign(user, req.body);

    user.save()
    .then(() => res.status(204).end())
    .catch(err => res.status(500).send(err));
  },
  updateMyPassword(req, res) {
    User.findOne({
      recoveryToken: req.query.recovery_token,
    })
    .then(user => {
      if (!user)
        return res.status(401).end();

      user.password = req.body.password;
      user.recoveryToken = undefined;

      user.save()
      .then(() => res.status(204).end())
      .catch(err => res.status(500).send(err));
    })
    .catch(err => {
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

export default UserController;
