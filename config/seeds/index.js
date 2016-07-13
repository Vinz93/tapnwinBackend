import mongoose from 'mongoose';
import seeder from 'mongoose-seeder';
import path from 'path';
import walkSync from 'walk-sync';
import DepTree from 'deptree';

import config from '../env';

const models = '../../server/models';
const seeds = {};
const files = {};
const tree = new DepTree();

walkSync(path.join(__dirname, models), {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.js')
    require(path.join(models, '/', file));
});

walkSync(__dirname, {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.json') {
    const name = path.basename(file, '.json');
    const content = require(`./${file}`);
    const model = content[name]._model;

    tree.add(model, content[name]._require);
    delete content[name]._require;

    files[model] = content;
  }
});

tree.resolve().forEach(name => {
  Object.assign(seeds, files[name]);
});

mongoose.connect(config.db).connection.once('open', () => {
  seeder.seed(seeds, {}, (err) => {
    if (err)
      console.log(err);

    mongoose.connection.close();
  });
});
