/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';

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

export default mongoose.model('Player', PlayerSchema);
