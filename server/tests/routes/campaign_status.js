/* eslint-disable */
import chai from 'chai';
import chaihttp from 'chai-http';
import request from 'superagent';
import mongoose from 'mongoose';
import config from '../../../config/env';
import User from '../../models/common/user';
import Player from '../../models/common/player';
import Campaign from '../../models/common/campaign';
import CampaignStatus from '../../models/common/campaign_status';
import app from '../../../index';

let should = chai.should();
chai.use(chaihttp);

const global = {};

describe('CampaignStatus routes', () => {
  before(done => {
    User.remove({email: 'test@ludopia.net'})
    .then(() =>
      Player.create({
        email: 'test@ludopia.net',
        firstName: 'Test',
        password: 'test',
        gender: 'male',
        verified: true
      })
    )
    .then(player => {
      player.createSessionToken();
      return [player.save(), Campaign.findOne({})];
    })
    .spread((player, campaign) => {
      global.player = player;
      global.campaign = campaign;
      done();
    });
  });
  describe('GET /players/me/campaigns/{campaign_id}/campaign_status', () => {
    it('Have all properties correct', done => {
      chai.request(app)
        .get('/players/me/campaigns/' + global.campaign._id + '/campaign_status')
        .set('X-Auth-Token', global.player.sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('player');
          res.body.player.should.equal(global.player._id.toString());
          res.body.should.have.property('campaign');
          res.body.campaign.should.equal(global.campaign._id.toString());
          res.body.should.have.property('balance');
          res.body.balance.should.equal(global.campaign.balance);
          res.body.should.have.property('isBlocked');
          res.body.isBlocked.should.equal(true);
          res.body.should.have.property('m3');
          res.body.m3.score.should.equal(0);
          res.body.m3.moves.should.equal(global.campaign.m3.initialMoves);
          res.body.should.have.property('dyg');
          res.body.dyg.votesGiven.should.equal(0);
          res.body.dyg.votesReceived.should.equal(0);
          res.body.dyg.dressed.should.equal(0);
          res.body.should.have.property('vdlg');
          res.body.vdlg.tutorial.should.equal(-1);
          res.body.vdlg.answered.should.equal(0);
          res.body.vdlg.correct.should.equal(0);
          done();
        });
    });
  });

  describe('PATCH /players/me/campaign_statuses/{campaign_status_id}', () => {
    it('Successfully update m3.score', done => {
      CampaignStatus.findOrCreate({
        player: global.player._id,
        campaign: global.campaign._id,
      })
      .then(campaignStatus => {
        chai.request(app)
          .patch('/players/me/campaign_statuses/' + campaignStatus._id)
          .set('X-Auth-Token', global.player.sessionToken)
          .send({"m3.score": 2543})
          .end((err, res) => {
            res.should.have.status(200);
            CampaignStatus.findOrCreate({
              player: global.player._id,
              campaign: global.campaign._id,
            })
            .then(campaignStatus => {
              campaignStatus.should.be.a('object');
              campaignStatus.should.have.property('m3');
              campaignStatus.m3.score.should.equal(2543);
              campaignStatus.m3.isBlocked.should.equal(true);
              campaignStatus.should.have.property('dyg');
              campaignStatus.dyg.isBlocked.should.equal(true);
              campaignStatus.should.have.property('vdlg');
              campaignStatus.vdlg.isBlocked.should.equal(true);
              done();
            });
          });
      });
    });

    it('Successfully accomplished all the missions', done => {
      CampaignStatus.findOrCreate({
        player: global.player._id,
        campaign: global.campaign._id,
      })
      .then(campaignStatus => {
        chai.request(app)
          .patch('/players/me/campaign_statuses/' + campaignStatus._id)
          .set('X-Auth-Token', global.player.sessionToken)
          .send({
            "m3.score": 25430,
            "dyg.dressed": 60,
            "dyg.votesReceived": 30,
            "dyg.votesGiven": 90,
            "vdlg.answered": 40,
            "vdlg.correct": 70,
            "vdlg.tutorial": 2,
          })
          .end((err, res) => {
            res.should.have.status(200);
            CampaignStatus.findOrCreate({
              player: global.player._id,
              campaign: global.campaign._id,
            })
            .then(campaignStatus => {
              campaignStatus.should.be.a('object');
              campaignStatus.should.have.property('m3');
              campaignStatus.m3.score.should.equal(25430);
              campaignStatus.m3.isBlocked.should.equal(true);
              campaignStatus.should.have.property('dyg');
              campaignStatus.dyg.dressed.should.equal(60);
              campaignStatus.dyg.votesReceived.should.equal(30);
              campaignStatus.dyg.votesGiven.should.equal(90);
              campaignStatus.dyg.isBlocked.should.equal(true);
              campaignStatus.should.have.property('vdlg');
              campaignStatus.vdlg.answered.should.equal(40);
              campaignStatus.vdlg.correct.should.equal(70);
              campaignStatus.vdlg.tutorial.should.equal(2);
              campaignStatus.vdlg.isBlocked.should.equal(true);
              done();
            });
          });
      });
    });
  });

});
