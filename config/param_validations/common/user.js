import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  createRecoveryToken: {
    query: {
      type: Joi.string(),
    },
    body: {
      email: Joi.string().email().required(),
    },
  },

  readByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
  },

  updateByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    body: {
      email: Joi.string().email(),
      password: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string(),
      age: Joi.number().integer(),
    },
  },

  updatePassword: {
    query: {
      recovery_token: Joi.string().token(),
    },
    body: {
      password: Joi.string().required(),
    },
  },

  read: {
    params: {
      user_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      user_id: Joi.objectId().required(),
    },
    body: {
      email: Joi.string().email(),
      password: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string(),
      age: Joi.number().integer(),
    },
  },

  delete: {
    params: {
      user_id: Joi.objectId().required(),
    },
  },
};
