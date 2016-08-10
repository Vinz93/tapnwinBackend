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

  readAllByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    query: {
      offset: Joi.number().integer(),
      limit: Joi.number().integer(),
      exclusive: Joi.boolean(),
      random: Joi.boolean(),
    },
  },

  createByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    body: {
      campaign: Joi.objectId().required(),
      model: Joi.objectId().required(),
      items: Joi.array().items(Joi.objectId()),
    },
  },

  read: {
    params: {
      design_id: Joi.objectId().required(),
    },
  },
};
