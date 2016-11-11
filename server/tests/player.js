/* eslint-env node, mocha */
/* eslint-disable */
import chai from 'chai';
import chaihttp from 'chai-http';
import request from 'superagent';
import mongoose from 'mongoose';
import config from '../../config/env';
import User from '../models/common/user';
import app from '../../index';

let should = chai.should();
chai.use(chaihttp);
process.env.NODE_ENV = 'testing';


describe('Users', () => {

  beforeEach(done => {
    User.remove({}, (err) => {
       done();
    });
  });
  describe('/POST Player', () => {
    it('it should not POST a Player without email field', done => {
      const player = {
        firstName: 'Vincenzo',
        password: '123',
        gender: 'male',
      }
      chai.request(app)
        .post('/players')
        .send(player)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
           res.body.should.have.property('message');
           res.body.message.should.equal('"email" is required');
          done();
        });
    });
  });
});
