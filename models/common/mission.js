/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  gameIds: [{
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

mongoose.model('Mission', MissionSchema);
