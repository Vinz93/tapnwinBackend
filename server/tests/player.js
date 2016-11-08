import assert from 'assert';
import request from 'super-agent';
import mongoose from 'mongoose';
import config from '../config/env';
import Player from '../models/common/Player';
import User from '../models/common/User';
import app from '../config/express';

const API_URL = 'localhost:3003';

describe('User Tests', () => { // eslint-disable-line

  it('Creates a user', (done) => { // eslint-disable-line
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
    });
  });

  before(() => { // eslint-disable-line
    User.remove({ email: 'vincenzob@ludopia.net' });
    mongoose.connect(config.db);
    app.listen(3003);
  });
});
