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
      isPositive: Joi.boolean(),
      urls: {
        animation: Joi.string().uri().required(),
        enable: Joi.string().uri().required(),
        disable: Joi.string().uri().required(),
      },
    },
  },

  read: {
    params: {
      sticker_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      sticker_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string(),
      isPositive: Joi.boolean(),
      urls: {
        animation: Joi.string().uri(),
        enable: Joi.string().uri(),
        disable: Joi.string().uri(),
      },
    },
  },

  delete: {
    params: {
      sticker_id: Joi.objectId().required(),
    },
  },
};
