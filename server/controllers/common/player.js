/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Vincenzo Bianco
 */

import httpStatus from 'http-status';

import Player from '../../models/common/player';

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
    Player.create(req.body)
    .then(player =>{
      player.createVerificationToken();
                const template = path.join(config.root, '/server/views/mail/mail_verification');
                const send = req.app.locals.transporter.templateSender(new EmailTemplate(template));
              send({
                  to: player.email,
                  subject: 'Tap and Win Verification',
              }, {
                  player,
              }, err => {
                  if (err)
                      return next(err);

                  player.save()
                      .then(() => res.status(httpStatus.CREATED).end())
                      .catch(next);
              });
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
            Player.create(req.body)
                .then(player => {
                    player.createSessionToken();
                    res.status(201).json(player);
                })
                .catch(next);
        } else {
            user.createSessionToken();
            user.save();
            res.status(201).json(user)
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
                Player.create(req.body)
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
