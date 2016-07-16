/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';

import Campaign from './campaign';
import ModelAsset from '../dyg/model_asset';
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

CompanySchema.pre('remove', next => {
  Promise.all([
    Campaign.remove({ company: this.id }),
    ModelAsset.remove({ company: this.id }),
    Category.remove({ company: this.id }),
    Item.remove({ company: this.id }),
    Sticker.remove({ company: this.id }),
  ])
  .then(next)
  .catch(next);
});

CompanySchema.plugin(uniqueValidator);
CompanySchema.plugin(mongoosePaginate);
CompanySchema.plugin(fieldRemover);

export default mongoose.model('Company', CompanySchema);
