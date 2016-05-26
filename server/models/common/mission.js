/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from '../../helpers/fieldRemover';

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

MissionSchema.statics = {};

MissionSchema.plugin(mongoosePaginate);
MissionSchema.plugin(idValidator);
MissionSchema.plugin(fieldRemover);

export default mongoose.model('Mission', MissionSchema);
