import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readAll: {
    query: {
      offset: Joi.number().integer(),
      limit: Joi.number().integer(),
    },
  },

  read: {
    params: {
      asset_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      asset_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string().email(),
      url: Joi.string().uri(),
    },
  },

  delete: {
    params: {
      asset_id: Joi.objectId().required(),
    },
  },
};
