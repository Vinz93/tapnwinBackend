'use strict';

require('./user');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = mongoose.model('User');

const AdministratorSchema = new Schema({});

User.discriminator('Administrator', AdministratorSchema);
