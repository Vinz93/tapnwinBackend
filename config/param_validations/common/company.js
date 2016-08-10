import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    body: {
      name: Joi.string().required(),
    },
  },

  read: {
    params: {
      company_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      company_id: Joi.objectId().required(),
    },
    body: {
      name: Joi.string().email(),
    },
  },

  delete: {
    params: {
      company_id: Joi.objectId().required(),
    },
  },
};
