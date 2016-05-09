'use strict';

const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  desingId: {
    type: Schema.Types.ObjectId,
    ref: 'Desing'
  },
  stickerIds: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Sticker'
    }],
    validate: validate({
      validator: 'isLength',
      arguments: [0, 4]
    })
  }
}, {
  timestamps: true
});

mongoose.model('Vote', VoteSchema);
