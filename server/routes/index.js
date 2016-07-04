import express from 'express';
import commonRoutes from './common';
import dygRoutes from './dyg';
import vdlgRoutes from './vdlg';

const router = express.Router();  // eslint-disable-line new-cap

router.get('/health_check', (req, res) =>
  res.send('OK')
);

router.use(commonRoutes);
router.use(dygRoutes);
router.use(vdlgRoutes);

export default router;
