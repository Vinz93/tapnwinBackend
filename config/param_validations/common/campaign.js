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

  create: {
    body: {
      company: Joi.objectId().required(),
      name: Joi.string().required(),
      banner: Joi.string().required(),
      startAt: Joi.string().isoDate().required(),
      finishAt: Joi.string().isoDate().required(),
      dyg: {
        isActive: Joi.boolean(),
        blockable: Joi.boolean(),
        models: Joi.array().items(Joi.objectId()),
        stickers: Joi.array().items(Joi.objectId()),
        catalog: Joi.array().items({
          category: Joi.objectId(),
          items: Joi.array().items(Joi.objectId()),
        }),
        zones: Joi.array().items({
          categories: Joi.array().items(Joi.objectId()),
          isRequired: Joi.boolean(),
        }),
      },
      vdlg: {
        isActive: Joi.boolean(),
        blockable: Joi.boolean(),
      },
      m3: {
        isActive: Joi.boolean(),
        blockable: Joi.boolean(),
        blockTime: Joi.number(),
        initialMoves: Joi.number().integer(),
      },
      ddt: {
        isActive: Joi.boolean(),
        blockable: Joi.boolean(),
      },
    },
  },

  read: {
    params: {
      campaign_id: Joi.objectId().required(),
    },
  },

  readByCompany: {
    params: {
      company_id: Joi.objectId().required(),
    },
  },

  update: {
    params: {
      campaign_id: Joi.objectId().required(),
    },
    body: {
      company: Joi.objectId(),
      name: Joi.string(),
      banner: Joi.string(),
      startAt: Joi.string().isoDate(),
      finishAt: Joi.string().isoDate(),
      'dyg.isActive': Joi.boolean(),
      'dyg.blockable': Joi.boolean(),
      'dyg.models': Joi.array().items(Joi.objectId()),
      'dyg.stickers': Joi.array().items(Joi.objectId()),
      'dyg.catalog': Joi.array().items({
        category: Joi.objectId(),
        items: Joi.array().items(Joi.objectId()),
      }),
      'dyg.zones': Joi.array().items({
        categories: Joi.array().items(Joi.objectId()),
        isRequired: Joi.boolean(),
      }),
      'vdlg.isActive': Joi.boolean(),
      'vdlg.blockable': Joi.boolean(),
      'm3.isActive': Joi.boolean(),
      'm3.blockable': Joi.boolean(),
      'm3.blockTime': Joi.number(),
      'm3.initialMoves': Joi.number().integer(),
      'ddt.isActive': Joi.boolean(),
      'ddt.blockable': Joi.boolean(),
    },
  },

  delete: {
    params: {
      campaign_id: Joi.objectId().required(),
    },
  },
};
