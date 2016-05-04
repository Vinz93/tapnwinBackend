'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

const Company = mongoose.model('Company', CompanySchema);
