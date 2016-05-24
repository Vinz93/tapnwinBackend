/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

const urlValidator = [
  validate({
    validator: 'isURL',
    message: 'not a valid url'
  })
];

const ModelSchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign'
  },
  url: {
    type: String,
    required: true,
    validate: urlValidator
  }
}, {
  timestamps: true
});

ModelSchema.methods = {

};

ModelSchema.statics = {

};

mongoose.model('Model', ModelSchema);
