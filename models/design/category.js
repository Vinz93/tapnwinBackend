/**
 * @author Juan Sanchez
 * @description Category model definition
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

const ItemSchema = new Schema({
  url: {
    type: String,
    required: true,
    validate: urlValidator
  }
});

const CategorySchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign'
  },
  name: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    enum: {
      values: 'top mid bot'.split(' '),
      message: '`{VALUE}` is not a valid zone'
    }
  },
  items: [ItemSchema]
});

CategorySchema.methods = {

};

CategorySchema.statics = {

};

mongoose.model('Category', CategorySchema);
