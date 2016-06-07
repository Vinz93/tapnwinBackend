import express from 'express';
import Session from '../controllers/common/session';
import Campaign from '../controllers/common/campaign';
import Category from '../controllers/design/category';
import Design from '../controllers/design/design';
import Item from '../controllers/design/item';
import Model from '../controllers/design/model';
import Vote from '../controllers/design/vote';
import Sticker from '../controllers/design/sticker';

import uploader from '../helpers/uploader';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/media', (req, res) => {
  const asset = 'design';

  uploader(asset, 'file')(req, res, err => {
    if (err) {
      return res.status(400).send(err);
    }
    res.json({ url: `${req.app.locals.config.host}uploads/${asset}/${req.file.filename}` });
  });
});

// Models

router.get('/models', Model.readAll);

router.route('/campaigns/:campaign_id/models')
.all(Campaign.check)
.get(Model.readAllByCampaign)
.post(Model.create);

router.route('/campaigns/:campaign_id/models/:model_id')
.all(Campaign.check)
.get(Model.read)
.put(Model.update)
.delete(Model.delete);

// Stickers

router.route('/campaigns/:campaign_id/stickers')
.all(Campaign.check)
.get(Sticker.readAllByCampaign)
.post(Sticker.create);

router.route('/stickers/:sticker_id')
.get(Sticker.read)
.put(Sticker.update)
.delete(Sticker.delete);

// Items

router.route('/items')
.get(Item.readAll)
.post(Item.create);

router.route('/items/:item_id')
.get(Item.read)
.patch(Item.update)
.delete(Item.delete);

export default router;

router.route('/designs')
.get(Design.readAll);

router.route('/campaigns/:campaign_id/designs')
.get(Design.readAllByCampaign)
.post(Design.create);

router.route('/players/me/campaigns/:campaign_id/designs')
.get(Session.validate, Design.readAllByMeCampaign);

router.route('/designs/:design_id')
.get(Design.read);

router.route('/players/me/designs/:design_id/votes')
.get(Session.validate, Vote.readByMe)
.post(Session.validate, Vote.create);

router.route('/categories')
.get(Category.readAll);

router.route('/campaigns/:campaign_id/categories')
.get(Category.readAllByCampaign)
.post(Category.create);

router.route('/categories/:category_id')
.get(Category.read)
.patch(Category.update)
.delete(Category.delete);
