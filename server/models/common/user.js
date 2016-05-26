/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from '../../helpers/fieldRemover';
import crypto from 'crypto';
import randtoken from 'rand-token';

const Schema = mongoose.Schema;

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email',
  }),
];

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: emailValidator,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessionToken: {
    type: String,
    required: false,
  },
  recoveryToken: {
    type: String,
    required: false,
  },
  recoveredAt: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

UserSchema.methods = {
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },
  generateToken() {
    return `${this._id}${randtoken.generate(16)}`;
  },
  createSessionToken() {
    this.sessionToken = this.generateToken();
  },
  createRecoveryToken(time) {
    if (this.recoveredAt && ((Date.now() - this.recoveredAt.getTime()) <= time))
      return false;

    this.recoveryToken = this.generateToken();
    this.recoveredAt = new Date();

    return true;
  },
  updatePassword(password, time) {
    if (Date.now() - this.recoveredAt.getTime() > time)
      return false;

    this.password = password;
    this.recoveryToken = undefined;
    this.recoveredAt = undefined;

    return true;
  },
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password'))
    return next();

  user.password = crypto.createHash('md5').update(user.password).digest('hex');

  next();
});

UserSchema.plugin(fieldRemover, 'password sessionToken recoveryToken recoveredAt');
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);