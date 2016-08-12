import Joi from 'joi';

export default {
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      gender: Joi.string().required(),
      bornAt: Joi.string().isoDate().required(),
    },
  },
};
