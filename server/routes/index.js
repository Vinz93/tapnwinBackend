import express from 'express';
import commonRoutes from './common';
import designRoutes from './design';
import voiceRoutes from './voice';

const router = express.Router();  // eslint-disable-line new-cap

router.get('/health_check', (req, res) =>
  res.send('OK')
);

router.use(commonRoutes);
router.use(designRoutes);
router.use(voiceRoutes);

export default router;
