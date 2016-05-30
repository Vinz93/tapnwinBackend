import express from 'express';
import commonRoutes from './common';
import designRoutes from './design';

const router = express.Router();  // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use(commonRoutes);
router.use(designRoutes);

export default router;
