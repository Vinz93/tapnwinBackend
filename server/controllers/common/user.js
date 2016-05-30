/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
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
      const config = locals.config;
      const template = path.join(config.root, '/server/views/mail/password_recovery');
      const send = locals.mailer.templateSender(new EmailTemplate(template));

      if (!user.createRecoveryToken(config.times.recovery))
        return res.status(409).end();

      send({
        to: user.email,
        subject: 'Password recovery',
      }, {
        user,
      }, err => {
        if (err)
          return res.status(500).send(err);

        user.save()
        .then(() => res.status(201).end())
        .catch(err => res.status(500).send(err));
      });
    })
    .catch(err => res.status(500).send(err));
  },
  updateMe(req, res) {
    const user = res.locals.user;

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

      const config = req.app.locals.config;

      if (!user.updatePassword(req.body.password, config.times.update))
        return res.status(409).end();

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
  isAdministrator(req, res, next) {
    if (res.locals.user.__t !== 'Administrator')
      return res.status(403).end();

    next();
  },
  isPlayer(req, res, next) {
    if (res.locals.user.__t !== 'Player')
      return res.status(403).end();

    next();
  },
};

export default UserController;
