/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Carlos Avilan
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

      if(!user.verified && user.__t == 'Player')
          return Promise.reject(new APIError('User is not verified yet', httpStatus.UNAUTHORIZED));

      user.createSessionToken();
      user.lastLogin = Date.now();

      return user.save();
    })
    .then((user) => res.status(httpStatus.CREATED).json({
      token: user.sessionToken,
      lastLogin: user.lastLogin}))
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
   /**
    * @swagger
    * /sessions/last_login/{id}:
    *   post:
    *     tags:
    *       - Sessions
    *     description: check is the token is expired with the lastLogin field
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         description: User id
    *         in: path
    *         required: true
    *         type: string
    *       - name: User lastLogin
    *         description: Object with last login
    *         in: body
    *         required: true
    *         schema:
    *           properties:
    *             lastLogin:
    *               type: string
    *               format: date-time
    *     responses:
    *       200:
    *         description: The token is valid
    */
  lastLogin(req, res, next){
    User.findById(req.params.id)
      .then(response =>{
        if(!response)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));
        const time =  response.lastLogin.getTime() -  new Date(req.body.lastLogin);
        if(time == 0)
            return httpStatus.OK;
        return httpStatus.UNAUTHORIZED;
      })
      .then(status => res.status(status).end())
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
