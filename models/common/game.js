'use strict';

// TODO: Cascade delete of relations with Mission model

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');

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

mongoose.model('Game', GameSchema);
