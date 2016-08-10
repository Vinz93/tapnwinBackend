import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  read: {
    params: {
      asset_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      asset_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string().email(),
      url: Joi.string().uri(),
    },
  },

  delete: {
    params: {
      asset_id: Joi.objectId().required(),
    },
  },
};
