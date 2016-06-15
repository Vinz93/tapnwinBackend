import express from 'express';

import User from '../controllers/common/user';
import Session from '../controllers/common/session';
import Category from '../controllers/design/category';
import Design from '../controllers/design/design';
import Item from '../controllers/design/item';
import Model from '../controllers/design/model';
import Vote from '../controllers/design/vote';
import Sticker from '../controllers/design/sticker';

import uploader from '../helpers/uploader';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/design/media', (req, res) => {
  const asset = 'design';

  uploader(asset, 'file')(req, res, err => {
    if (err)
      return res.status(400).send(err);

    res.json({ url: `${req.app.locals.config.host}uploads/${asset}/${req.file.filename}` });
  });
});

router.get('/models', Model.readAll);

router.route('/companies/:company_id/models')
.get(Model.readAllByCompany)
.post(Model.create);

router.route('/models/:model_id')
.get(Model.read)
.put(Model.update)
.delete(Model.delete);

router.get('/items', Item.readAll);

router.route('/companies/:company_id/items')
.get(Item.readAllByCompany)
.post(Item.create);

router.route('/items/:item_id')
.get(Item.read)
.put(Item.update)
.delete(Item.delete);

router.get('/categories', Category.readAll);

router.route('/companies/:company_id/categories')
.get(Category.readAllByCompany)
.post(Category.create);

router.route('/categories/:category_id')
.get(Category.read)
.patch(Category.update)
.delete(Category.delete);

router.route('/designs')
.get(Design.readAll);

router.route('/campaigns/:campaign_id/designs')
.get(Design.readAllByCampaign);

router.route('/players/me/campaigns/:campaign_id/designs')
.all(Session.validate, User.isPlayer)
.get(Design.readAllByMeCampaign)
.post(Design.createByMeCampaign);

router.route('/designs/:design_id')
.get(Design.read);

router.route('/votes')
.get(Vote.readAll);

router.route('/designs/:design_id/votes')
.get(Vote.readAllByDesign);

router.route('/players/me/designs/:design_id/votes')
.all(Session.validate, User.isPlayer)
.get(Vote.readByMeDesign)
.post(Design.doesntBelongToMe, Vote.createByMeDesign);

router.route('/designs/:design_id/votes/statistics')
.get(Vote.readStatisticByDesign);

router.route('/votes/:vote_id')
.get(Vote.read)
.patch(Session.validate, Vote.update);

router.route('/stickers')
.get(Sticker.readAll);

router.route('/companies/:company_id/stickers')
.get(Sticker.readAllByCompany)
.post(Sticker.create);

router.route('/stickers/:sticker_id')
.get(Sticker.read)
.put(Sticker.update)
.delete(Sticker.delete);

export default router;
