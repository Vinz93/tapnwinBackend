/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import CampaignStatus from '../../models/common/campaignStatus';

const StatusController = {

  readByMe(req, res, next) {
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
      next(err);
    });
  },

  updateByMe(req, res, next) {
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
    .catch(next);
  },
};

export default StatusController;
