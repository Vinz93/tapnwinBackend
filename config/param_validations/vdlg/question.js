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

  read: {
    params: {
      question_id: Joi.objectId().required(),
    },
  },

  readStatistic: {
    params: {
      question_id: Joi.objectId().required(),
    },
  },
};
