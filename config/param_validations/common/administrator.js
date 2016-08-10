import Joi from 'joi';

export default {
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
};
