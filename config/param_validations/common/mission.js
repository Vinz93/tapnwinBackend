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

  create: {
    body: {
      code: Joi.string().required(),
      description: Joi.string().required(),
    },
  },

  read: {
    params: {
      mission_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      mission_id: Joi.objectId().required(),
    },
    body: {
      code: Joi.string(),
      description: Joi.string(),
    },
  },

  delete: {
    params: {
      mission_id: Joi.objectId().required(),
    },
  },
};
