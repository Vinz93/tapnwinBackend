'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Game = mongoose.model('Game', GameSchema);
