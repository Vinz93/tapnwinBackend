/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import path from 'path';
import templates from 'email-templates';

import User from '../../models/common/user';
import Player from '../../models/common/player';
import Administrator from '../../models/common/administrator';

const EmailTemplate = templates.EmailTemplate;

const UserController = {

  read(req, res, next) {
    User.findById(req.params.user_id)
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.json(user);
    })
    .catch(next);
  },

  readByMe(req, res) {
    res.json(res.locals.user);
  },

  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    User.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(users => res.json(users))
    .catch(next);
  },

  createRecoveryToken(req, res, next) {
    const UserAbs = (req.query.type === 'Administrator') ? Administrator : Player;

    UserAbs.findOne({
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
        .catch(next);
      });
    })
    .catch(next);
  },

  updateByMe(req, res, next) {
    const user = res.locals.user;

    Object.assign(user, req.body);

    user.save()
    .then(() => res.status(204).end())
    .catch(next);
  },

  updatePassword(req, res, next) {
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
      .catch(next);
    })

    .catch(next);
  },

  delete(req, res, next) {
    User.findByIdAndRemove(req.params.user_id)
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
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
