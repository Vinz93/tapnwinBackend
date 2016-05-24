'use strict';

const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const AdministratorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

AdministratorSchema.plugin(paginate);

mongoose.model('Administrator', AdministratorSchema);
