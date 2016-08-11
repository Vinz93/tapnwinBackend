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
      company: Joi.objectId().required(),
      name: Joi.string().required(),
      urls: {
        small: Joi.string().uri().required(),
        large: Joi.string().uri().required(),
      },
    },
  },

  read: {
    params: {
      item_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      item_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string(),
      'urls.small': Joi.string().uri(),
      'urls.large': Joi.string().uri(),
    },
  },

  delete: {
    params: {
      item_id: Joi.objectId().required(),
    },
  },
};
