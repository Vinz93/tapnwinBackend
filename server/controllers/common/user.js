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
/**
 * @swagger
 * /api/v1/users:
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

/**
 * @swagger
 * /api/v1/users/recovery_token:
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

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
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
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     description: Updates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
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

    Object.assign(user, req.body);

    user.save()
    .then(() => res.status(204).end())
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/users/password:
 *   patch:
 *     tags:
 *       - Users
 *     description: Updates user's password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: recovery_token
 *         description: User's recovery token
 *         in: query
 *         required: true
 *         type: string
 *       - name: user
 *         description: User object
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
 *         description: Successfully updated
 */
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

/**
 * @swagger
 * /api/v1/users/{id}:
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
        return res.status(404).end();

      res.json(user);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/user/{user_id}:
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
        return res.status(404).end();

      Object.assign(user, req.body);

      user.save()
      .then(() => res.status(204).end())
      .catch(next);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/users/{id}:
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
