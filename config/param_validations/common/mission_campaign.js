import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    body: {
      mission: Joi.objectId().required(),
      campaign: Joi.objectId().required(),
      isRequired: Joi.boolean(),
      isBlocking: Joi.boolean(),
      blockTime: Joi.number(),
      balance: Joi.number(),
      max: Joi.number().integer(),
    },
  },

  read: {
    params: {
      mission_campaign_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      mission_campaign_id: Joi.objectId().required(),
    },

    body: {
      mission: Joi.objectId(),
      campaign: Joi.objectId(),
      isRequired: Joi.boolean(),
      isBlocking: Joi.boolean(),
      blockTime: Joi.number(),
      balance: Joi.number(),
      max: Joi.number().integer(),
    },
  },

  delete: {
    params: {
      mission_campaign_id: Joi.objectId().required(),
    },
  },
};
