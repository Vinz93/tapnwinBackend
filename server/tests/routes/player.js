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
describe('Player routes', () => {
  beforeEach(done => {
    User.remove({}, (err) => {
       done();
    });
  });
  describe('POST /players', () => {
    it('it should not create a user without email field', done => {
      const player = {
        firstName: 'Vincenzo',
        password: '123',
        gender: 'male',
      };
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
        email: 'vincenzob2@ludopia.net',
        firstName: 'Vincenzo',
        password: '123',
        gender: 'male',
      };
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

  describe('POST /players/facebook', () => {
    it('Should create verified users from facebook', done => {
      const player = {
        firstName: 'Vincenzo',
        facebookId: '123secret',
        email: 'tester@mocha.today',
      };
      chai.request(app)
      .post('/players/facebook')
      .send(player)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('age');
        res.body.should.have.property('verified');
        res.body.verified.should.equal(true);
        done();
      });
    });
    it('Should create users from facebook without email', done => {
      const player = {
        firstName: 'Vincenzo',
        facebookId: '123secret',
      };
      chai.request(app)
      .post('/players/facebook')
      .send(player)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        done();
      });
    });

    it('Should return sessionToken when create an user', done => {
      const player = {
        firstName: 'Todd',
        facebookId: '123',
      };
      chai.request(app)
      .post('/players/facebook')
      .send(player)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('sessionToken');
        res.body.sessionToken.should.not.be.null;
        res.body.sessionToken.should.not.be.undefined;
        res.body.should.have.property('verified');
        res.body.verified.should.equal(true);
        done();
      });

    });

      it('Should login when the user was created before', done => {
        const player = {
          firstName: 'Vincenzo',
          facebookId: '123secret',
        };
        Player.create(player)
          .then(() => {
            chai.request(app)
            .post('/players/facebook')
            .send(player)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('sessionToken');
              res.body.sessionToken.should.not.be.null;
              res.body.sessionToken.should.not.be.undefined;
              done();
            })
          });
      });
      it('Should verify and login user when they made a previous register', done => {
        const player = {
          firstName: 'Vincenzo',
          email:'vinz@mocha.com',
          gender: 'male',
        };
        Player.create(player)
          .then(previousPlayer => {
            previousPlayer.verified.should.equal(false);
            player.facebookId = 'unique';
            chai.request(app)
            .post('/players/facebook')
            .send(player)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('sessionToken');
              res.body.sessionToken.should.not.be.null;
              res.body.sessionToken.should.not.be.undefined;
              res.body.verified.should.equal(true);
              done();
            })
          });
      });
      it('Should login users with verified email from register', done => {
        const player = {
          firstName: 'Vincenzo',
          email:'vinz@mocha.com',
          gender: 'male',
          verified: true,
        };
        Player.create(player)
          .then(previousPlayer => {
            delete player.verified;
            player.facebookId = 'unique';
            previousPlayer.verified.should.equal(true);
            chai.request(app)
            .post('/players/facebook')
            .send(player)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('sessionToken');
              res.body.sessionToken.should.not.be.null;
              res.body.sessionToken.should.not.be.undefined;
              done();
            })
          });
      });
    });

    describe('POST /players/twitter', () => {
      it('Should create verified users from twitter', done => {
        const player = {
          firstName: 'Vincenzo',
          twitterId: '123secret',
          email: 'tester@mocha.today',
        };
        chai.request(app)
        .post('/players/twitter')
        .send(player)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('age');
          res.body.should.have.property('verified');
          res.body.verified.should.equal(true);
          done();
        });
      });
      it('Should create users from twitter without email', done => {
        const player = {
          firstName: 'Vincenzo',
          twitterId: '123secret',
        };
        chai.request(app)
        .post('/players/twitter')
        .send(player)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          done();
        });
      });

      it('Should return sessionToken when create an user', done => {
        const player = {
          firstName: 'Todd',
          twitterId: '123',
        };
        chai.request(app)
        .post('/players/twitter')
        .send(player)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('sessionToken');
          res.body.sessionToken.should.not.be.null;
          res.body.sessionToken.should.not.be.undefined;
          res.body.should.have.property('verified');
          res.body.verified.should.equal(true);
          done();
        });

      });

      it('Should login when the user was created before', done => {
        const player = {
          firstName: 'Vincenzo',
          twitterId: '123secret',
        };
        Player.create(player)
          .then(() => {
            chai.request(app)
            .post('/players/twitter')
            .send(player)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('sessionToken');
              res.body.sessionToken.should.not.be.null;
              res.body.sessionToken.should.not.be.undefined;
              done();
            })
          });
      });
      it('Should verify and login user when they made a previous register', done => {
        const player = {
          firstName: 'Vincenzo',
          email:'vinz@mocha.com',
          gender: 'male',
        };
        Player.create(player)
          .then(previousPlayer => {
            previousPlayer.verified.should.equal(false);
            player.twitterId = 'unique';
            chai.request(app)
            .post('/players/twitter')
            .send(player)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('sessionToken');
              res.body.sessionToken.should.not.be.null;
              res.body.sessionToken.should.not.be.undefined;
              res.body.verified.should.equal(true);
              done();
            })
          });
      });
    });
});
