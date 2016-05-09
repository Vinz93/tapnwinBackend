'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  gameIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

mongoose.model('Mission', MissionSchema);
