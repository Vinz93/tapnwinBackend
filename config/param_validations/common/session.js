import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    query: {
      type: Joi.string(),
    },
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },

  delete: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
  },
};
