/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MissionsListSchema = new Schema({
  missionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission'
  },
  isRequired: {
    type: Boolean,
    defualt: false
  },
  isBlocking: {
    type: Boolean,
    defualt: false
  },
  blockedTime: { // Minutes
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    min: [1, '`{VALUE}` is not a valid max'],
    default: 1
  }
});

const GamesListSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Game'
  },
  missions: [MissionsListSchema]
});

const CampaignSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  games: [GamesListSchema],
  name: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  finishAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

CampaignSchema.methods = {

};

CampaignSchema.statics = {

};

const Campaign = mongoose.model('Campaign', CampaignSchema);
