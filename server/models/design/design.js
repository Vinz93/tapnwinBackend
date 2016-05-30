/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

const DesingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

DesingSchema.plugin(mongoosePaginate);
DesingSchema.plugin(idValidator);
DesingSchema.plugin(fieldRemover);

export default mongoose.model('Desing', DesingSchema);
