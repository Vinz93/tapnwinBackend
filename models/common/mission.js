'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const idvalidator = require('mongoose-id-validator');

require('../../models/common/game');

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
MissionSchema.plugin(idvalidator);

mongoose.model('Mission', MissionSchema);
