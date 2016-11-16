/* eslint-disable */
import chai from 'chai';
import chaihttp from 'chai-http';
import request from 'superagent';
import mongoose from 'mongoose';
import config from '../../../config/env';
import User from '../../models/common/user';
import app from '../../../index';

let should = chai.should();
let expect = chai.expect();
chai.use(chaihttp);

describe('User Model', () => {

  beforeEach(done => {
    User.remove({}, (err) => {
       done();
    });
  });
  describe('fields and virtuals', () => {
    it('reject invalid email format', done => {
      const user = new User({
        email: 'test',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        done();
      })
    });

    it('Accept a valid email format', done => {
      const user = new User({
        email: 'unique@should.com',
      });
      User.create(user)
      .then(user => {
        user.should.be.a('object');
        user.should.have.property('id');
        done();
      });
    });
    it('email field should be unique', done => {
      const user = new User({
        email: 'unique@should.com',
      });
      user.validate(err => {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('methods', () => {
    it('simpleToken should generate 4 digits tokens', done => {
      const user = new User({
        email: 'test@test.com',
      });

      user.createVerificationToken();
      user.should.have.property('verificationToken');
      user.verificationToken.toString().length.should.equal(4);
      user.verificationToken.should.to.be.at.least(1);
      user.verificationToken.should.to.be.at.most(9999);
      done();
    });
  });

});
