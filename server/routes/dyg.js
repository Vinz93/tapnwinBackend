import express from 'express';
import validate from 'express-validation';

import modelAssetValidator from '../../config/param_validations/dyg/model_asset';
import categoryValidator from '../../config/param_validations/dyg/category';
import designValidator from '../../config/param_validations/dyg/design';
import itemValidator from '../../config/param_validations/dyg/item';
import voteValidator from '../../config/param_validations/dyg/vote';
import stickerValidator from '../../config/param_validations/dyg/sticker';
import User from '../controllers/common/user';
import Session from '../controllers/common/session';
import ModelAsset from '../controllers/dyg/model_asset';
import Category from '../controllers/dyg/category';
import Design from '../controllers/dyg/design';
import Item from '../controllers/dyg/item';
import Vote from '../controllers/dyg/vote';
import Sticker from '../controllers/dyg/sticker';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/model_assets')
.post(validate(modelAssetValidator.create), ModelAsset.create);

router.route('/items')
.get(validate(itemValidator.readAll), Item.readAll)
.post(validate(itemValidator.create), Item.create);

router.route('/items/:item_id')
.get(validate(itemValidator.read), Item.read)
.patch(validate(itemValidator.update), Item.update)
.delete(validate(itemValidator.delete), Item.delete);

router.route('/categories')
.get(validate(categoryValidator.readAll), Category.readAll)
.post(validate(categoryValidator.create), Category.create);

router.route('/categories/:category_id')
.get(validate(categoryValidator.read), Category.read)
.patch(validate(categoryValidator.update), Category.update)
.delete(validate(categoryValidator.delete), Category.delete);

router.route('/designs')
.get(validate(designValidator.readAll), Design.readAll);

router.route('/players/me/designs')
.get(validate(designValidator.readAllByMe), Session.validate, User.isPlayer, Design.readAllByMe)
.post(validate(designValidator.createByMe), Session.validate, User.isPlayer, Design.createByMe);

router.route('/designs/:design_id')
.get(validate(designValidator.read), Design.read);

router.route('/votes')
.get(validate(voteValidator.readAll), Vote.readAll);

router.route('/players/me/votes')
.post(validate(voteValidator.createByMe), Session.validate, User.isPlayer, Vote.createByMe);

router.route('/players/me/designs/:design_id/vote')
.get(validate(voteValidator.readByMeDesign), Session.validate, User.isPlayer, Vote.readByMeDesign);

router.route('/designs/:design_id/votes/statistics')
.get(validate(voteValidator.readStatisticByDesign), Vote.readStatisticByDesign);

router.route('/votes/:vote_id')
.get(validate(voteValidator.read), Vote.read);

router.route('/players/me/votes/:vote_id')
.patch(validate(voteValidator.updateByMe), Session.validate, User.isPlayer, Vote.updateByMe);

router.route('/stickers')
.get(validate(stickerValidator.readAll), Sticker.readAll)
.post(validate(stickerValidator.create), Sticker.create);

router.route('/stickers/:sticker_id')
.get(validate(stickerValidator.read), Sticker.read)
.patch(validate(stickerValidator.update), Sticker.update)
.delete(validate(stickerValidator.delete), Sticker.delete);

export default router;
