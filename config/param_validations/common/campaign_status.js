import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },

    params: {
      campaign_id: Joi.objectId().required(),
    },
  },

  updateByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },

    params: {
      campaign_status_id: Joi.objectId().required(),
    },

    body: {
      isBlocked: Joi.boolean(),
      m3: {
        score: Joi.number().integer(),
        moves: Joi.number().integer(),
        isBlocked: Joi.boolean(),
      },
    },
  },
};
