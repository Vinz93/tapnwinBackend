'use strict';

const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

const StickerSchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  isPositive: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: validate({
      validator: 'isUrl',
      message: 'The url provided is not valid.'
    })
  }
}, {
  timestamps: true
});

mongoose.model('Sticker', StickerSchema);
