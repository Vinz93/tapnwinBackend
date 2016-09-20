import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },

    params: {
      campaign_id: Joi.objectId().required(),
    },
  },

  updateByMe: {
    headers: {
      'x-auth-token': Joi.string().token().required(),
    },

    params: {
      campaign_status_id: Joi.objectId().required(),
    },

    body: {
      isBlocked: Joi.boolean(),
      'm3.score': Joi.number().integer(),
      'm3.moves': Joi.number().integer(),
      'm3.isBlocked': Joi.boolean(),
      'dyg.dressed': Joi.number().integer(),
      'dyg.votesGiven': Joi.number().integer(),
      'dyg.votesReceived': Joi.number().integer(),
      'dg.isBlocked': Joi.boolean(),
      'vdlg.correct': Joi.number().integer(),
      'vdlg.answered': Joi.number().integer(),
      'vdlg.isBlocked': Joi.boolean(),
    },
  },
};
