import Joi from 'joi';

export default {
  create: {
    body: {
      company: Joi.objectId().required(),
      name: Joi.string().email().required(),
      url: Joi.string().uri().required(),
    },
  },
};
