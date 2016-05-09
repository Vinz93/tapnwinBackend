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

mongoose.model('Game', GameSchema);
