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
        selected: Joi.string().uri().required(),
        unselected: Joi.string().uri().required(),
      },
    },
  },

  read: {
    params: {
      category_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      category_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string(),
      urls: {
        selected: Joi.string().uri(),
        unselected: Joi.string().uri(),
      },
    },
  },

  delete: {
    params: {
      category_id: Joi.objectId().required(),
    },
  },
};
