/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import config from '../../../config/env';
import Campaign from './campaign';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   CampaignStatus:
 *     properties:
 *       player:
 *         type: string
 *       campaign:
 *         type: string
 *       balance:
 *         type: number
 *         format: float
 *       dyg:
 *         type: boolean
 *       vdlg:
 *         type: boolean
 *       m3:
 *         type: boolean
 *       ddt:
 *         type: boolean
 *     required:
 *       - player
 *       - campaign
 */
const CampaignStatusSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  design: Boolean,
  voice: Boolean,
  match3: Boolean,
  owner: Boolean,
}, {
  timestamps: true,
});

CampaignStatusSchema.plugin(mongoosePaginate);
CampaignStatusSchema.plugin(idValidator);
CampaignStatusSchema.plugin(fieldRemover);

CampaignStatusSchema.post('findOne', function (result, next) {
  if (result)
    return next();

  const body = this.getQuery();

  Campaign.findById(body.campaign)
  .then(campaign => {
    config.games.map(game => {
      if (campaign[game.name].active)
        body[game.name] = true;
      return body;
    });

    CampaignStatus.create(body) // eslint-disable-line no-use-before-define
    .then(next)
    .catch(next);
  })
  .catch(next);
});

const CampaignStatus = mongoose.model('CampaignStatus', CampaignStatusSchema);

export default CampaignStatus;
