/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import ValidationError from '../../helpers/validationError';
import fieldRemover from '../../helpers/fieldRemover';
import Promise from 'bluebird';

import Mission from '../../models/common/mission';

const Schema = mongoose.Schema;

const MissionsListSchema = new Schema({
  mission: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission',
  },
  isRequired: {
    type: Boolean,
    defualt: false,
  },
  isBlocking: {
    type: Boolean,
    defualt: false,
  },
  blockedTime: { // Minutes
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    min: [1, '`{VALUE}` is not a valid max'],
    default: 1,
  },
}, { _id: false });

const GamesListSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Game',
  },
  missions: [MissionsListSchema],
}, { _id: false });

const CampaignSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  games: [GamesListSchema],
  name: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  finishAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

CampaignSchema.methods = {};

CampaignSchema.statics = {};

CampaignSchema.pre('remove', next => {
  next();
});

CampaignSchema.plugin(mongoosePaginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

CampaignSchema.pre('save', function (next) {
  if (this.finishAt <= this.startAt) {
    return next(new ValidationError('Invalid date range', {
      startAt: this.startAt,
      finishAt: this.finishAt,
    }));
  }
  next();
});

CampaignSchema.pre('save', function (next) {
  Campaign.find({
    $or: [{ startAt: { $lte: this.startAt }, finishAt: { $gte: this.startAt } },
    { startAt: { $lte: this.finishAt }, finishAt: { $gte: this.finishAt } },
    { startAt: { $gte: this.startAt }, finishAt: { $lte: this.finishAt } }],
    company: this.company,
  })
  .then(campaigns => {
    if (campaigns.length > 0) {
      return next(new ValidationError('Invalid date range', {
        startAt: this.startAt,
        finishAt: this.finishAt,
      }));
    }
    next();
  })
  .catch(next);
});

CampaignSchema.pre('save', function (next) {
  Promise.map(this.games, game =>
    Promise.map(game.missions, mission =>
      Mission.findById(mission.mission)
      .then(missionDoc => {
        if (missionDoc.games.indexOf(game.game) === -1) {
          return next(new ValidationError('Missions/Game don\'t match', {
            game: game.game,
            mission: mission.mission,
          }));
        }
      })
    )
  )
  .then(next)
  .catch(next);
});

export default Campaign;
