/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Vincenzo Bianco
 */

import path from 'path';
import templates from 'email-templates';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import User from '../../models/common/user';
import Player from '../../models/common/player';
import Administrator from '../../models/common/administrator';

const EmailTemplate = templates.EmailTemplate;

const UserController = {
  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - Users
   *     description: Returns all users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: limit
   *         description: Return limit
   *         in: query
   *         required: false
   *         type: integer
   *       - name: offset
   *         description: Return offset
   *         in: query
   *         required: false
   *         type: integer
   *     responses:
   *       200:
   *         description: An array of users
   *         schema:
   *           properties:
   *             docs:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/definitions/User'
   *                   - properties:
   *                       id:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *             total:
   *               type: integer
   *             limit:
   *               type: integer
   *             offset:
   *               type: integer
   */
  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };
    const select = {
      sessionToken: 0,
      facebookId: 0,
      twitterId: 0,
      lastLogin: 0,
    };

    User.paginate(find, {
      sort,
      select,
      offset,
      limit,
    })
    .then(users => res.json(users))
    .catch(next);
  },

  /**
   * @swagger
   * /users/check:
   *   post:
   *     tags:
   *       - Users
   *     description: check the user email with the token sended
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: player
   *         description: Player object
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *             email:
   *               type: string
   *             verificationToken:
   *               type: string
   *           required:
   *             - email
   *             - verificationToken
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Player'
   *              - properties:
   *                  id:
   *                    type: string
   *                  balance:
   *                    type: integer
   *                  age:
   *                    type: integer
   *                  createdAt:
   *                    type: string
   *                    format: date-time
   *                  updatedAt:
   *                    type: string
   *                    format: date-time
   */


  checkVerificationToken(req, res, next) {
    const expiredTime = req.app.locals.config.times.expired;
    Player.findOne({
      email: req.body.email,
    })
      .then(player => {
        if (!player)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));

        if (!(player.verificationToken === req.body.verificationToken) ||
         player.expiredVerification(expiredTime))
          return Promise.reject(new APIError('Invalid Token', httpStatus.BAD_REQUEST));

        player.verificationToken = undefined;
        player.verified = true;
        player.createSessionToken();
        player.lastLogin = Date.now();
        return player.save();
      })
      .then(player => res.json(player))
      .catch(next);
  },

  /**
   * @swagger
   * /users/recovery_token:
   *   post:
   *     tags:
   *       - Users
   *     description: Creates a recovery token
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: player
   *         description: Player object
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *             email:
   *               type: string
   *           required:
   *             - email
   *     responses:
   *       201:
   *         description: Successfully created
   */
  createRecoveryToken(req, res, next) {
    const UserChild = (req.query.type === 'Administrator') ? Administrator : Player;

    UserChild.findOne({
      email: req.body.email,
    })
      .then(user => {
        if (!user)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));

        const config = req.app.locals.config;

        const template = path.join(config.root, '/server/views/mail/password_recovery');
        const send = req.app.locals.mailer.templateSender(new EmailTemplate(template));

        user.createRecoveryToken();

        send({
          from: '"tap&win" <registro@tapandwin.today>',
          to: user.email,
          subject: 'Recupera tu contraseña',
        }, {
          user,
        }, err => {
          if (err)
            return next(err);

          user.save()
            .then(() => res.status(httpStatus.CREATED).end())
            .catch(next);
        });
      })
      .catch(next);
  },

  /**
   * @swagger
   * /users/me:
   *   get:
   *     tags:
   *       - Users
   *     description: Returns a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: X-Auth-Token
   *         description: User's session token
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A user
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/User'
   *              - properties:
   *                  id:
   *                    type: string
   *                  createdAt:
   *                    type: string
   *                    format: date-time
   *                  updatedAt:
   *                    type: string
   *                    format: date-time
   */
  readByMe(req, res) {
    res.json(res.locals.user);
  },

  /**
   * @swagger
   * /users/me:
   *   patch:
   *     tags:
   *       - Users
   *     description: Updates a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: X-Auth-Token
   *         description: User's session token
   *         in: header
   *         required: true
   *         type: string
   *       - name: user
   *         description: User object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       201:
   *         description: Successfully updated
   */
  updateByMe(req, res, next) {
    const user = res.locals.user;

    user.set(req.body);

    user.save()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  /**
   * @swagger
   * /users/password:
   *   put:
   *     tags:
   *       - Users
   *     description: Updates user's password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         description: User object
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *             email:
   *               type: string
   *             recovery_token:
   *               type: string
   *             password:
   *               type: string
   *           required:
   *             - email
   *     responses:
   *       201:
   *         description: Successfully updated
   */
  updatePassword(req, res, next) {
    User.findOne({
      email: req.body.email,
    })
      .then(user => {
        if (!user)
          return Promise.reject(new APIError('User not found.', httpStatus.NOT_FOUND));
        if (req.body.recovery_token !== user.recoveryToken)
          return Promise.reject(new APIError('Invalid recovery Token.', httpStatus.BAD_REQUEST));
        user.updatePassword(req.body.password);
        return user.save();
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags:
   *       - Users
   *     description: Returns a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: User's id
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A user
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/User'
   *              - properties:
   *                  id:
   *                    type: string
   *                  createdAt:
   *                    type: string
   *                    format: date-time
   *                  updatedAt:
   *                    type: string
   *                    format: date-time
   */
  read(req, res, next) {
    User.findById(req.params.user_id)
      .then(user => {
        if (!user)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));

        res.json(user);
      })
      .catch(next);
  },

  /**
   * @swagger
   * /user/{user_id}:
   *   patch:
   *     tags:
   *       - Users
   *     description: Updates a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user_id
   *         description: User's id
   *         in: path
   *         required: true
   *         type: string
   *       - name: User
   *         description: User object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       201:
   *         description: Successfully updated
   */
  update(req, res, next) {
    User.findById(req.params.user_id)
      .then(user => {
        if (!user)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));
        user.set(req.body);
        return user.save();
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  /**
   * @swagger
   * /users/email/{user_id}:
   *   put:
   *     tags:
   *       - Users
   *     description: Updates a user email and send the verification Token again
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user_id
   *         description: User's id
   *         in: path
   *         required: true
   *         type: string
   *       - name: email
   *         description: User email
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       204:
   *         description: Successfully updated
   */

  updateEmail(req, res, next) {
    const config = req.app.locals.config;
    const template = path.join(config.root, '/server/views/mail/mail_verification');
    const send = req.app.locals.mailer.templateSender(new EmailTemplate(template));
    User.findById(req.params.user_id)
      .then(player => {
        if (!player)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));
        player.email = req.body.email;
        player.createVerificationToken();
        return player.save()
          .then(player => {
            send({
              from: '"tap&win" <registro@tapandwin.today>',
              to: player.email,
              subject: 'Confirma tu registro',
            }, {
              player,
            }, err => {
              if (err)
                return next(err);
            });
          })
          .catch(err => err);
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     description: Deletes a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: User's id
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  delete(req, res, next) {
    User.findById(req.params.user_id)
      .then(user => {
        if (!user)
          return Promise.reject(new APIError('User not found', httpStatus.NOT_FOUND));

        return user.remove();
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  isAdministrator(req, res, next) {
    if (res.locals.user.__t !== 'Administrator')
      return Promise.reject(new APIError('Invalid user type', httpStatus.UNAUTHORIZED));

    next();
  },

  isPlayer(req, res, next) {
    if (res.locals.user.__t !== 'Player')
      return Promise.reject(new APIError('Invalid user type', httpStatus.UNAUTHORIZED));

    next();
  },
};

export default UserController;
