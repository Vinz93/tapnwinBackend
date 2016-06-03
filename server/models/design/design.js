/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import random from 'mongoose-random';

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  stickers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Sticker',
    }],
    validate: validate({
      validator: 'isLength',
      arguments: [0, 4],
    }),
  },
}, {
  timestamps: true,
  _id: false,
});

const DesignSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  topItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  },
  midItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  },
  botItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  },
  votes: [VoteSchema],
}, {
  timestamps: true,
});

DesignSchema.plugin(mongoosePaginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover);
DesignSchema.plugin(random);

export default mongoose.model('Design', DesignSchema);
