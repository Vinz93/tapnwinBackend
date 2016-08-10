import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    body: {
      campaign: Joi.objectId().required(),
      personal: Joi.string().required(),
      popular: Joi.string().required(),
      inbox: Joi.string().required(),
      startAt: Joi.string().isoDate().required(),
      finishAt: Joi.string().isoDate().required(),
      possibilities: Joi.array().items(Joi.string()),
    },
  },
};
