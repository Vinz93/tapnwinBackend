/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');

require('../../models/common/campaign');

const Campaign = mongoose.model('Campaign');

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

mongoose.model('Company', CompanySchema);
