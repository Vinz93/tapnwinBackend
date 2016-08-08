import Joi from 'joi';

export default {
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required(),
    },
  },

  updateUser: {
    body: {
      email: Joi.string(),
      x: {
        y: Joi.string(),
      },
    },
    params: {
      user_id: Joi.string().hex().required(),
    },
  },
};
