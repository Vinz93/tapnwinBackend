/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../../helpers/api_error';
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
 *             token:
 *               type: string
 */
  create(req, res, next) {
    const UserChild = (req.query.type === 'Administrator') ? Administrator : Player;

    UserChild.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));

      if (!user.authenticate(req.body.password))
        return Promise.reject(new APIError('Invalid password', httpStatus.BAD_REQUEST));

      user.createSessionToken();

      return user.save();
    })
    .then((user) => res.status(httpStatus.CREATED).json({ token: user.sessionToken }))
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
 *       - name: X-Auth-Token
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
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },

  validate(req, res, next) {
    const sessionToken = req.get('X-Auth-Token');

    User.findOne({ sessionToken })
    .then(user => {
      if (!user)
        return Promise.reject(new APIError('User not found', httpStatus.UNAUTHORIZED));

      res.locals.user = user;

      next();
    })
    .catch(next);
  },
};

export default SessionController;
