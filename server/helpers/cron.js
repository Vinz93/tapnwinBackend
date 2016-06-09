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
      const url = `${config.host}uploads/design/${fileName}`;
      return Promise.all([
        Item.findOne({ url }),
        Model.findOne({ url }),
        Sticker.findOne({ url }),
      ])
      .then(array => {
        for (let i = 0; i < array.length; i++)
          if (array[i])
            return;
        fs.unlinkSync(path.join(config.root,
        `/uploads/design/${fileName}`));
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
