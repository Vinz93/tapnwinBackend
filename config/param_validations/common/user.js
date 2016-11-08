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

  createRecoveryToken: {
    query: {
      type: Joi.string(),
    },
    body: {
      email: Joi.string().email().required(),
    },
  },

  checkVerificationToken: {
    body: {
      email: Joi.string().email().required(),
      verificationToken: Joi.string().required(),
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
      bornAt: Joi.string().isoDate().required(),
    },
  },

  updatePassword: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      recovery_token: Joi.string().token(),
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
      bornAt: Joi.string().isoDate(),
    },
  },

  updateEmail: {
    params: {
      user_id: Joi.objectId().required(),
    },
    body: {
      email: Joi.string().email().required(),
    },
  },

  delete: {
    params: {
      user_id: Joi.objectId().required(),
    },
  },
};
