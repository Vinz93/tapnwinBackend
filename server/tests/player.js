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
    it('it should not POST a user without email field', done => {
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

    it('it should Create a user with all required fields', done => {
      const player = {
        email: 'vincenzob@ludopia.net',
        firstName: 'Vincenzo',
        password: '123',
        gender: 'male',
      }
      chai.request(app)
      .post('/players')
      .send(player)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('age');
        res.body.should.have.property('verified');
        res.body.verified.should.equal(false);
        done();
      });
    });
  });

});
