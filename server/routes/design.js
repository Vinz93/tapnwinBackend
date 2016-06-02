import express from 'express';
import Category from '../controllers/design/category';
import Design from '../controllers/design/design';
import Model from '../controllers/design/model';
import Sticker from '../controllers/design/sticker';

import Campaign from '../controllers/common/campaign';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/models', Model.readAll);

router.post('/models/media', Model.upload);

router.route('/campaigns/:campaign_id/models')
.all(Campaign.check)
.get(Model.readByACampaign)
.post(Model.createByACampaign);

export default router;
