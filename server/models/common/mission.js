/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
// import ValidationError from '../../helpers/validationError';
import fieldRemover from 'mongoose-field-remover';
// import config from '../../../config/env';

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  /* games: [{
    type: String,
    enum: {
      values: config.games.map(game => game.id),
      message: '`{VALUE}` is not a valid game',
    },
  }],*/
  code: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

MissionSchema.pre('save', next => {
  /* if (this.games.length === 0)
    return next(new ValidationError('GamesArrayEmpty'));*/
  next();
});

MissionSchema.plugin(mongoosePaginate);
MissionSchema.plugin(idValidator);
MissionSchema.plugin(fieldRemover);

export default mongoose.model('Mission', MissionSchema);
