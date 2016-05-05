/**
 * @author Juan Sanchez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  assetUrl: {
    type: String,
    required: true
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
      values: 'chest legs shoes'.split(' '),
      message: '`{VALUE}` is not a valid zone'
    }
  },
  items: [ItemSchema]
});

CategorySchema.methods = {

};

CategorySchema.statics = {

};

const Category = mongoose.model('Category', CategorySchema);
