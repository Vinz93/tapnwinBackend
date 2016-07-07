import express from 'express';

import User from '../controllers/common/user';
import Session from '../controllers/common/session';
// import Campaign from '../controllers/common/campaign';
import Asset from '../controllers/common/asset';
import Category from '../controllers/dyg/category';
import Design from '../controllers/dyg/design';
import Item from '../controllers/dyg/item';
import Model from '../controllers/dyg/model';
import Vote from '../controllers/dyg/vote';
import Sticker from '../controllers/dyg/sticker';

import uploader from '../helpers/uploader';

const router = express.Router(); // eslint-disable-line new-cap

router.post('/dyg/media', (req, res) => {
  const asset = 'dyg';

  uploader(asset, 'file')(req, res, err => {
    if (err)
      return res.status(400).send(err);

    res.json({ url: `${req.app.locals.config.host}uploads/${asset}/${req.file.filename}` });
  });
});

router.route('/models')
.get(Model.readAll)
.post(Model.create);

router.route('/models/:model_id')
.get(Asset.read)
.patch(Model.update)
.delete(Asset.delete);

router.route('/items')
.get(Item.readAll)
.post(Item.create);

router.route('/items/:item_id')
.get(Item.read)
.patch(Item.update)
.delete(Item.delete);

router.route('/categories')
.get(Category.readAll)
.post(Category.create);

router.route('/categories/:category_id')
.get(Category.read)
.patch(Category.update)
.delete(Category.delete);

router.route('/designs')
.get(Design.readAll);

router.route('/players/me/designs')
.all(Session.validate, User.isPlayer)
.get(Design.readAllByMe)
.post(Design.createByMe);

router.route('/designs/:design_id')
.get(Design.read);

router.route('/votes')
.get(Vote.readAll);

router.route('/players/me/votes')
.all(Session.validate, User.isPlayer)
.post(Design.doesntBelongToMe, Vote.createByMe);

router.route('/players/me/designs/:design_id/votes')
.all(Session.validate, User.isPlayer)
.get(Vote.readByMeDesign);

router.route('/designs/:design_id/votes/statistics')
.get(Vote.readStatisticByDesign);

router.route('/votes/:vote_id')
.get(Vote.read)
.patch(Session.validate, User.isPlayer, Vote.update);

router.route('/stickers')
.get(Sticker.readAll)
.post(Sticker.create);

router.route('/stickers/:sticker_id')
.get(Sticker.read)
.put(Sticker.update)
.delete(Sticker.delete);

export default router;
