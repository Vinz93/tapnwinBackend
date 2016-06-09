import express from 'express';

import Session from '../controllers/common/session';
import Company from '../controllers/common/company';

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

// Models

router.get('/models', Model.readAll);

router.route('/companies/:company_id/models')
.all(Company.check)
.get(Model.readAllByCompany)
.post(Model.create);

router.route('/companies/:company_id/models/:model_id')
.all(Company.check)
.get(Model.read)
.put(Model.update)
.delete(Model.delete);

// Items

router.get('/items', Item.readAll);

router.route('/companies/:company_id/items')
.all(Company.check)
.get(Item.readAllByCompany)
.post(Item.create);

router.route('/companies/:company_id/items/:item_id')
.all(Company.check)
.get(Item.read)
.put(Item.update)
.delete(Item.delete);

// Categories

router.get('/categories', Category.readAll);

router.route('/companies/:company_id/categories')
.all(Company.check)
.get(Category.readAllByCompany)
.post(Category.create);

router.route('/companies/:company_id/categories/:category_id')
.all(Company.check)
.get(Category.read)
.patch(Category.update)
.delete(Category.delete);

// Designs

router.route('/designs')
.get(Design.readAll);

router.route('/campaigns/:campaign_id/designs')
.get(Design.readAllByCampaign);

router.route('/players/me/campaigns/:campaign_id/designs')
.get(Session.validate, Design.readAllByMeCampaign)
.post(Session.validate, Design.createByMeCampaign);

router.route('/designs/:design_id')
.get(Design.read);

// Votes

router.route('/votes')
.get(Vote.readAll);

router.route('/designs/:design_id/votes')
.get(Vote.readAllByDesign);

router.route('/players/me/designs/:design_id/votes')
.get(Session.validate, Vote.readByMeDesign)
.post(Session.validate, Design.doesntBelongToMe, Vote.createByMeDesign);

router.route('/designs/:design_id/votes/statistics')
.get(Vote.readStatisticByDesign);

router.route('/votes/:vote_id')
.get(Vote.read)
.patch(Session.validate, Vote.update);

// Stickers

router.route('/stickers')
.get(Sticker.readAll);

router.route('/companies/:company_id/stickers')
.all(Company.check)
.get(Sticker.readAllByCompany)
.post(Sticker.create);

router.route('/companies/:company_id/stickers/:sticker_id')
.all(Company.check)
.get(Sticker.read)
.put(Sticker.update)
.delete(Sticker.delete);

export default router;
