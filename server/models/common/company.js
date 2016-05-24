/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

import Campaign from '../../models/common/campaign';

const Schema = mongoose.Schema;

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

CompanySchema.methods = {};

CompanySchema.statics = {};

CompanySchema.pre('remove', next => {
  Campaign.remove({ companyId: this.id })
  .then(next)
  .catch(next);
});

CompanySchema.plugin(uniqueValidator);
CompanySchema.plugin(mongoosePaginate);

export default mongoose.model('Company', CompanySchema);
