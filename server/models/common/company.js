/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';

import { removeIterative } from '../../helpers/utils';
import Campaign from './campaign';
import Asset from './asset';
import Category from '../dyg/category';
import Item from '../dyg/item';
import Sticker from '../dyg/sticker';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Company:
 *     properties:
 *       name:
 *         type: string
 *     required:
 *       - name
 */
const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
}, {
  timestamps: true,
});

CompanySchema.post('remove', next => {
  const company = this.id;

  Promise.all([
    Campaign.remove({ company }).then(campaigns => removeIterative(campaigns)),
    Asset.remove({ company }),
    Category.remove({ company }),
    Item.remove({ company }),
    Sticker.remove({ company }),
  ])
  .then(next)
  .catch(next);
});

CompanySchema.plugin(uniqueValidator);
CompanySchema.plugin(paginate);
CompanySchema.plugin(fieldRemover);

export default mongoose.model('Company', CompanySchema);
