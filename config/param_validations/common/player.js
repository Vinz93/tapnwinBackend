import Joi from 'joi';

export default {
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      gender: Joi.string().required(),
      bornAt: Joi.string().isoDate(),
    },
  },
  facebookLogin: {
    body: {
      email: Joi.string().email(),
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      gender: Joi.string(),
      bornAt: Joi.string().isoDate(),
      facebookId: Joi.string().required(),
    }
  },
  twitterLogin: {
    body: {
      email: Joi.string().email(),
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      gender: Joi.string(),
      bornAt: Joi.string().isoDate(),
      twitterId: Joi.string().required(),
    }
  }
};
