/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import random from 'mongoose-random';

// import Vote from './vote';
// import Sticker from './sticker';

const Schema = mongoose.Schema;

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
}, {
  timestamps: true,
});

DesignSchema.plugin(mongoosePaginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover);
DesignSchema.plugin(random);
/*
DesignSchema.virtual('votes').get(function () {
  const res = {};
  const criteria = {
    design: this._id,
  };

  Sticker.find()
  .then(stickers => Promise.map(stickers, sticker => {
    criteria['stickers._id'] = sticker._id;

    return Vote.count(criteria)
      .then(count => {
        res[sticker._id] = count;
      });
  }).then(() => res));
});
*/
export default mongoose.model('Design', DesignSchema);
