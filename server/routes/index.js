import express from 'express';

import uploader from '../helpers/uploader';

import common from './common';
import dyg from './dyg';
import vdlg from './vdlg';

const router = express.Router();  // eslint-disable-line new-cap

router.get('/time', (req, res) => {
  const time = new Date();
  res.json({ time });
});

router.post('/media', (req, res) => {
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
