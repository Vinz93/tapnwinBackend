/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Vincenzo Bianco
 */

import httpStatus from 'http-status';
import templates from 'email-templates';
import path from 'path';

import Player from '../../models/common/player';
import APIError from '../../helpers/api_error';

const EmailTemplate = templates.EmailTemplate;

const PlayerController = {
  /**
   * @swagger
   * /players:
   *   post:
   *     tags:
   *       - Players
   *     description: Creates a player
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: player
   *         description: Player object
   *         in: body
   *         required: true
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Player'
   *              - properties:
   *                  password:
   *                    type: string
   *                required:
   *                  - password
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
  create(req, res, next) {
    const config = req.app.locals.config;
    const template = path.join(config.root, '/server/views/mail/mail_verification');
    const send = req.app.locals.mailer.templateSender(new EmailTemplate(template));
    Player.findOne({
        email: req.body.email
      })
      .then(player => {
        if (!player) {
          Player.create(req.body)
            .then(player => {
              player.createVerificationToken();
              send({
                to: player.email,
                subject: 'Tap and Win Verification',
              }, {
                player,
              }, err => {
                if (err)
                  return next(err);
                player.save()
                  .then(player => res.status(httpStatus.CREATED).json(player))
                  .catch(next);
              });
            });
        } else {
          if (player.verified == true)
            return Promise.reject(new APIError('the user already exist', httpStatus.UNPROCESSABLE_ENTITY));

          player.set(req.body);
          player.createVerificationToken();
          send({
            to: player.email,
            subject: 'Tap and Win Verification',
          }, {
            player,
          }, err => {
            if (err)
              return next(err);
            player.save()
              .then(player =>  res.status(httpStatus.OK).json(player))
              .catch(next);
          });
        }
      })
      .catch(next);
  },

  /**
   * @swagger
   * /players/facebook:
   *   post:
   *     tags:
   *       - Players
   *     description: Creates a player from facebook
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: player
   *         description: Player object
   *         in: body
   *         required: true
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Player'
   *              - properties:
   *                  facebookId:
   *                    type: string
   *                required:
   *                  - facebookId
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
   *                  facebookId:
   *                    type: string
   *                  sessionToken:
   *                    type: string
   */
  facebookLogin(req, res, next) {
    Player.findOne({
        facebookId: req.body.facebookId
      }).then(user => {
        if (!user) {
          let data = req.body;
          data.verified = true;
          Player.create(data)
            .then(player => {
              player.createSessionToken();
              player.save();
              res.status(httpStatus.CREATED).json(player);
            })
            .catch(next);
        } else {
          user.createSessionToken();
          user.save();
          res.status(200).json(user);
        }
      })
      .catch(next);
  },


  /**
   * @swagger
   * /players/twitter:
   *   post:
   *     tags:
   *       - Players
   *     description: Creates a player from twitter
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: player
   *         description: Player object
   *         in: body
   *         required: true
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Player'
   *              - properties:
   *                  twitterId:
   *                    type: string
   *                required:
   *                  - twitterId
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
   *                  twitterId:
   *                    type: string
   *                  sessionToken:
   *                    type: string
   */



  twitterLogin(req, res, next) {
    Player.findOne({
        twitterId: req.body.twitterId
      }).then(user => {
        if (!user) {
          let data = req.body;
          data.verified = true;
          Player.create(data)
            .then(player => {
              player.createSessionToken();
              player.save();
              res.status(201).json(player);
            })
            .catch(next);
        } else {
          user.createSessionToken();
          user.save();
          res.status(200).json(user);
        }
      })
      .catch(next);
  }



};

export default PlayerController;
