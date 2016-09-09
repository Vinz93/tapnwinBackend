import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readAllByMe: {
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
      mission_status_id: Joi.objectId().required(),
    },

    body: {
      value: Joi.number().integer(),
    },
  },
};
