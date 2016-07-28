/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Mission:
 *     properties:
 *       code:
 *         type: string
 *       description:
 *         type: string
 *     required:
 *       - code
 *       - description
 */
const MissionSchema = new Schema({
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

MissionSchema.plugin(paginate);
MissionSchema.plugin(idValidator);
MissionSchema.plugin(fieldRemover);

export default mongoose.model('Mission', MissionSchema);
