/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

// TODO: Cascade delete of relations with Mission model

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

// const Promise = require('bluebird');

// require('../../models/common/mission');

// const Mission = mongoose.model('Mission');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
}, {
  timestamps: true,
});

GameSchema.statics = {};

GameSchema.pre('remove', next => {
  next();
});

GameSchema.plugin(mongoosePaginate);
GameSchema.plugin(uniqueValidator);

export default mongoose.model('Game', GameSchema);
