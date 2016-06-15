import express from 'express';
import commonRoutes from './common';
import designRoutes from './design';

const router = express.Router();  // eslint-disable-line new-cap

router.get('/health_check', (req, res) =>
  res.send('OK')
);

router.use(commonRoutes);
router.use(designRoutes);

export default router;
