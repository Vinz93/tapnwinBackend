/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import ValidationError from '../../helpers/validationError';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game',
  }],
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

MissionSchema.pre('save', function (next) {
  if (this.games.length === 0)
    return next(new ValidationError('GamesArrayEmpty'));
  next();
});

MissionSchema.plugin(mongoosePaginate);
MissionSchema.plugin(idValidator);
MissionSchema.plugin(fieldRemover);

export default mongoose.model('Mission', MissionSchema);
