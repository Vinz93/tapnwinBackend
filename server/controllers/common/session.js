/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import User from '../../models/common/user';
import Player from '../../models/common/player';
import Administrator from '../../models/common/administrator';

const SessionController = {
/**
 * @swagger
 * /sessions:
 *   post:
 *     tags:
 *       - Sessions
 *     description: Creates a user's session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: User's type
 *         in: query
 *         required: true
 *         type: string
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/User'
 *              - properties:
 *                  password:
 *                    type: string
 *                required:
 *                  - password
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           properties:
 *             sessionToken:
 *               type: string
 */
  create(req, res, next) {
    const UserType = (req.query.type === 'Administrator') ? Administrator : Player;

    UserType.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return res.status(404).end();

      if (!user.authenticate(req.body.password))
        return res.status(400).end();

      user.createSessionToken();

      return user.save();
    })
    .then((user) => res.status(201).json({ sessionToken: user.sessionToken }))
    .catch(next);
  },

/**
 * @swagger
 * /sessions:
 *   delete:
 *     tags:
 *       - Sessions
 *     description: Deletes a user's session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: User's session token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    const user = res.locals.user;

    user.sessionToken = undefined;

    user.save()
    .then(() => res.status(204).end())
    .catch(next);
  },

  validate(req, res, next) {
    const sessionToken = req.get('Session-Token');

    if (!sessionToken)
      return res.status(401).end();

    User.findOne({ sessionToken })
    .then(user => {
      if (!user)
        return res.status(401).end();

      res.locals.user = user;

      next();
    })
    .catch(next);
  },
};

export default SessionController;
