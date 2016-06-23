/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import User from '../../models/common/user';
import Player from '../../models/common/player';
import Administrator from '../../models/common/administrator';

const SessionController = {
  create(req, res) {
    const UserAbs = (req.query.type === 'Administrator') ? Administrator : Player;

    UserAbs.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      if (!user.authenticate(req.body.password))
        return res.status(400).end();

      user.createSessionToken();

      user.save()
      .then(() => res.status(201).json({
        sessionToken: user.sessionToken,
      }))
      .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
  },

  delete(req, res) {
    const user = res.locals.user;

    user.sessionToken = undefined;

    user.save()
    .then(() => res.status(204).end())
    .catch(err => res.status(500).send(err));
  },

  validate(req, res, next) {
    User.findOne({
      sessionToken: req.get('sessionToken'),
    })
    .then(user => {
      if (!user)
        return res.status(401).end();

      res.locals.user = user;

      next();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};

export default SessionController;
