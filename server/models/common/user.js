/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import crypto from 'crypto';
import randtoken from 'rand-token';
import timeUnit from 'time-unit';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       email:
 *         type: string
 *     required:
 *       - email
 */
const UserSchema = new Schema({
  email: {
    type: String,
    validate: validate({
      validator: 'isEmail',
      message: 'not a valid email',
    }),
    unique: true,
    uniqueCaseInsensitive: true,
    sparse: true,
  },
  password: {
    type: String
  },
  sessionToken: {
    type: String,
    required: false,
  },
  verificationToken: {
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
  verified: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {
  timestamps: true,
});

UserSchema.methods = {
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },

  expiredVerification(time) {
    const limit = timeUnit.hours.toMillis(time);
    if (Date.now() - this.createdAt.getTime() > limit)
        return true;
    return false;
},

  generateToken() {
    return `${this._id}${randtoken.generate(16)}`;
  },

  createSessionToken() {
    this.sessionToken = this.generateToken();
  },

  createVerificationToken() {
    this.verificationToken = this.generateToken();
},

  createRecoveryToken(time) {
    const ms = timeUnit.hours.toMillis(time);

    if (this.recoveredAt && (Date.now() - this.recoveredAt.getTime() <= ms))
      return false;

    this.recoveryToken = this.generateToken();
    this.recoveredAt = new Date();

    return true;
  },

  updatePassword(password, time) {
    const ms = timeUnit.hours.toMillis(time);

    if (Date.now() - this.recoveredAt.getTime() > ms)
      return false;

    this.password = password;
    this.recoveryToken = undefined;
    this.recoveredAt = undefined;

    return true;
  },
};

UserSchema.pre('save', function(next) {
  if (!this.isModified('password'))
    return next();

  this.password = crypto.createHash('md5').update(this.password).digest('hex');

  next();
});

UserSchema.plugin(fieldRemover, 'password recoveryToken recoveredAt verificationToken');
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);
