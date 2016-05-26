/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

// TODO: Cascade delete of relations with Mission model

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from '../../helpers/fieldRemover';

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

GameSchema.plugin(mongoosePaginate);
GameSchema.plugin(uniqueValidator);
GameSchema.plugin(fieldRemover);

export default mongoose.model('Game', GameSchema);
