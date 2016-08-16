/**
 * @author Juan Sanchez
 * @description Cron file remover
 * @lastModifiedBy Juan Sanchez
 */

import cron from 'cron';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import config from './../../config/env';

const CronJob = cron.CronJob;

// Design models with assets

import Item from '../models/design/item';
import Model from '../models/design/model';
import Sticker from '../models/design/sticker';
import Category from '../models/design/category';

// Voice models with assets

// TODO

// Match3 models with assets

// TODO

// Owner models with assets

// TODO

// Design cron job

new CronJob('5 0 * * *', () => { // eslint-disable-line no-new
  fs.readdir(path.join(config.root, 'uploads', 'design'), (err, dir) => {
    dir.map(fileName => {
      const url = `${config.host}uploads/${fileName}`;
      return Promise.all([
        Item.findOne({ $or: [
          { 'media.small': url },
          { 'media.large': url },
        ] }),
        Model.findOne({ media: url }),
        Sticker.findOne({ $or: [
          { 'media.animation': url },
          { 'media.enable': url },
          { 'media.disable': url },
        ] }),
        Category.findOne({ $or: [
          { 'media.selected': url },
          { 'media.unselected': url },
        ] }),
      ])
      .then(array => {
        for (let i = 0; i < array.length; i++)
          if (array[i])
            return;
        fs.unlinkSync(path.join(config.root,
        `/uploads/${fileName}`));
      })
      .catch(err => {
        console.log(err);
      });
    });
  });
}, null, true, 'America/Caracas');

// Voice cron job

// TODO

// Match3 cron job

// TODO

// Owner cron job

// TODO
