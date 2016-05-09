'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  missionId: {
    type: Schema.Types.ObjectId,
    ref: 'Mission'
  },
  value: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

mongoose.model('Status', StatusSchema);
