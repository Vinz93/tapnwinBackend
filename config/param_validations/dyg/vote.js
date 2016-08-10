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

  createByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    body: {
      design: Joi.objectId().required(),
      stickers: Joi.array().items(Joi.objectId()),
    },
  },

  read: {
    params: {
      vote_id: Joi.objectId().required(),
    },
  },

  readByMeDesign: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    params: {
      design_id: Joi.objectId().required(),
    },
  },

  readStatisticByDesign: {
    params: {
      design_id: Joi.objectId().required(),
    },
  },

  updateByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },
    params: {
      vote_id: Joi.objectId().required(),
    },
    body: {
      design: Joi.objectId(),
      stickers: Joi.array().items(Joi.objectId()),
    },
  },
};
