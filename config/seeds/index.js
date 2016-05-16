const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');
const path = require('path');
const walkSync = require('walk-sync');
const extend = require('util')._extend;

const config = require('../env');
const modelsPath = '../../models';
var seeds = {};

walkSync(path.join(__dirname, modelsPath), {
  directories: false
}).forEach(function(file) {
  if (path.extname(file) === '.js')
    require(path.join(modelsPath, '/', file));
});

walkSync(__dirname, {
  directories: false
}).forEach(function(file) {
  if (path.extname(file) === '.json')
    extend(seeds, require('./' + file));
});

mongoose.connect(config.db).connection.once('open', function() {
  seeder.seed(seeds).then(function(dbData) {
    mongoose.connection.close();
  }).catch(function(err) {
    console.log(err);
  });
});
