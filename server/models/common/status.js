/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  missionId: {
    type: Schema.Types.ObjectId,
    ref: 'Mission',
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

StatusSchema.plugin(mongoosePaginate);
StatusSchema.plugin(idValidator);

mongoose.model('Status', StatusSchema);
