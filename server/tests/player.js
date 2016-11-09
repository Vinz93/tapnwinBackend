import assert from 'assert';
// import { assert } from 'chai';
import request from 'superagent';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import config from '../../config/env';
// import Player from '../models/common/player';
import User from '../models/common/user';
import app from '../../config/express';

const API_URL = 'localhost:3004';
mongoose.Promise = Promise;

describe('User Tests', () => { // eslint-disable-line

  it('Creates a user', done => { // eslint-disable-line
    request
    .post(`${API_URL}/players`)
    .send({
      email: 'vincenzob@ludopia.net',
      password: '123',
      firstName: 'Vincenzo',
      gender: 'male',
    })
    .end((err, res) => {
      assert.ifError(err);
      const user = JSON.parse(res.text);
      assert.equal(user.email, 'vincenzob@ludopia.net');
      assert.equal(user.verified, false);
      done();
    });
  });

  it('the token has 4 digits', done => { // eslint-disable-line
    User.findOne({ email: 'vincenzob@ludopia.net' })
      .then(user => {
        const token = Number(user.verificationToken);
        assert.equal(typeof token, 'number');
        assert.equal(user.verificationToken.length, 4);
        done();
      });
  });

  before(() => { // eslint-disable-line
    mongoose.connect(config.db);
    app.listen(3004);
    User.remove({ email: 'vincenzob@ludopia.net' }, err => {
      if (err)
        console.log('error deleting vinz');
    });
  });
});
