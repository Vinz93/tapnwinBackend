const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');
const path = require('path');
const walkSync = require('walk-sync');

const config = require('../env');
const modelsPath = '../../models';
const seeds = {};

walkSync(path.join(__dirname, modelsPath), {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.js') {
    require(path.join(modelsPath, '/', file));
  }
});

walkSync(__dirname, {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.json') {
    Object.assign(seeds, require('./${file}'));
  }
});

mongoose.connect(config.db).connection.once('open', () => {
  seeder.seed(seeds).then(() => {
    mongoose.connection.close();
  }).catch(err => {
    console.err(err);
  });
});
