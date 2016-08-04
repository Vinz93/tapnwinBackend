import express from 'express';

import User from '../controllers/common/user';
import Session from '../controllers/common/session';
import ModelAsset from '../controllers/dyg/model_asset';
import Category from '../controllers/dyg/category';
import Design from '../controllers/dyg/design';
import Item from '../controllers/dyg/item';
import Vote from '../controllers/dyg/vote';
import Sticker from '../controllers/dyg/sticker';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/model_assets')
.post(ModelAsset.create);

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
.post(Vote.createByMe);

router.route('/players/me/designs/:design_id/vote')
.all(Session.validate, User.isPlayer)
.get(Vote.readByMeDesign);

router.route('/designs/:design_id/votes/statistics')
.get(Vote.readStatisticByDesign);

router.route('/votes/:vote_id')
.get(Vote.read);

router.route('players/me/votes/:vote_id')
.patch(Session.validate, User.isPlayer, Vote.updateByMe);

router.route('/stickers')
.get(Sticker.readAll)
.post(Sticker.create);

router.route('/stickers/:sticker_id')
.get(Sticker.read)
.patch(Sticker.update)
.delete(Sticker.delete);

export default router;
