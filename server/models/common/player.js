'use strict';

const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  gender: {
    type: String,
    enum: {
      values: 'male female'.split(' '),
      message: '`{VALUE}` is not a valid gender',
    },
  },
  age: {
    type: Number,
    min: [0, '`{VALUE}` is not a valid age'],
  },
}, {
  timestamps: true,
});

PlayerSchema.plugin(paginate);

mongoose.model('Player', PlayerSchema);
