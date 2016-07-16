import express from 'express';

import uploader from '../helpers/uploader';

import common from './common';
import dyg from './dyg';
import vdlg from './vdlg';

const router = express.Router();  // eslint-disable-line new-cap

/**
 * @swagger
 * /api/v1/time:
 *   get:
 *     tags:
 *       - Times
 *     description: Returns current time
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Current time
 *         schema:
 *           properties:
 *             time:
 *               type: string
 *               format: date-time
 */
router.get('/time', (req, res) => {
  const time = new Date();

  res.json({ time });
});

/**
 * @swagger
 * /api/v1/files:
 *   post:
 *     tags:
 *       - Files
 *     description: Uploads a file
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: File object
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           properties:
 *             url:
 *               type: string
 */
router.post('/files', (req, res) => {
  uploader('file')(req, res, err => {
    if (err)
      return res.status(400).send(err);

    res.json({ url: `${req.app.locals.config.host}uploads/${req.file.filename}` });
  });
});

router.use(common);
router.use(dyg);
router.use(vdlg);

export default router;
