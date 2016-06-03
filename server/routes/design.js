import express from 'express';
import Session from '../controllers/common/session';
import Category from '../controllers/design/category';
import Design from '../controllers/design/design';
import Item from '../controllers/design/item';
import Sticker from '../controllers/design/sticker';

const router = express.Router(); // eslint-disable-line new-cap

export default router;

router.route('/designs')
.get(Design.readAll);

router.route('/campaigns/:campaign_id/designs')
.get(Design.readAllByCampaign)
.post(Design.create);

router.route('/players/me/campaigns/:campaign_id/designs')
.get(Session.validate, Design.readAllByMeCampaign);

router.route('/designs/:category_id')
.get(Design.read)
.patch(Design.update)
.delete(Design.delete);

router.route('/categories')
.get(Category.readAll);

router.route('/campaigns/:campaign_id/categories')
.get(Category.readAllByCampaign)
.post(Category.create);

router.route('/categories/:category_id')
.get(Category.read)
.patch(Category.update)
.delete(Category.delete);

router.route('/items')
.get(Item.readAll)
.post(Item.create);

router.route('/items/:item_id')
.get(Item.read)
.patch(Item.update)
.delete(Item.delete);
