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
    },
  },

  createByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    body: {
      question: Joi.objectId().required(),
      personal: Joi.number().integer().required(),
      popular: Joi.number().integer().required(),
      seen: Joi.boolean(),
    },
  },

  read: {
    params: {
      answer_id: Joi.objectId().required(),
    },
  },

  readStatisticByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
  },

  updateByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    params: {
      answer_id: Joi.objectId().required(),
    },
    body: {
      seen: Joi.boolean(),
    },
  },
};
