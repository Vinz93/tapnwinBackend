'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DesingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  topItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  midItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  botItemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }
}, {
  timestamps: true
});

const Desing = mongoose.model('Desing', DesingSchema);
