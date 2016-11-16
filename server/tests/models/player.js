/* eslint-disable */
import chai from 'chai';
import chaihttp from 'chai-http';
import request from 'superagent';
import mongoose from 'mongoose';
import config from '../../../config/env';
import User from '../../models/common/user';
import Player from '../../models/common/player';
import app from '../../../index';

let should = chai.should();
chai.use(chaihttp);

describe('Player Model', () => {

  beforeEach(done => {
    User.remove({}, (err) => {
       done();
    });
  });

  describe('fields and virtuals', () => {
    it('firstName field is required', done => {
      let player = new Player({});
      player.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('firstName');
        done();
      });
    });

    it('email field is not required', done => {
      let player = new Player({});
      player.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.not.have.property('email');
        done();
      });
    });
    it('new players are not verified', done =>{
      const player = new Player({
        firstName: 'Vincenzo',
        gender: 'male',
      });
      player.should.have.property('verified');
      player.verified.should.equal(false);
      done();
    });
    it('players should have age field', done =>{
      const player = new Player({
        firstName: 'Vincenzo',
        gender: 'male',
      });
      player.should.have.property('age');
      player.age.should.equal(0);
      done();
    });

  });


});
