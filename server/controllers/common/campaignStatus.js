/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import CampaignStatus from '../../models/common/campaignStatus';

const StatusController = {

  readByMe(req, res) {
    const criteria = {
      player: res.locals.user.id,
      campaign: req.params.campaign_id,
    };

    CampaignStatus.findOne(criteria)
    .then(status => {
      res.json(status);
    })
    .catch(err => {
      if (err.id)
        return res.json(err);
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  updateByMe(req, res) {
    const criteria = {
      player: res.locals.user.id,
      campaign: req.params.campaign_id,
    };

    CampaignStatus.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(status => {
      if (!status)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },
};

export default StatusController;
