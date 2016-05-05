/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign'
  },
  assetUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

ModelSchema.methods = {

};

ModelSchema.statics = {

};

const Model = mongoose.model('Model', ModelSchema);
