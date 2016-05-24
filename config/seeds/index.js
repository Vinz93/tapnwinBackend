import mongoose from 'mongoose';
import seeder from 'mongoose-seeder';
import path from 'path';
import walkSync from 'walk-sync';

import DepTree from 'deptree';
import config from '../env';

const modelsPath = '../../models';
const seeds = {};
const files = {};
const tree = new DepTree();

walkSync(path.join(__dirname, modelsPath), {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.js')
    require(path.join(modelsPath, '/', file));
});

walkSync(__dirname, {
  directories: false,
}).forEach(file => {
  if (path.extname(file) === '.json') {
    const name = path.basename(file, '.json');
    const content = require(`./${file}`);

    tree.add(name, content[name].deps);
    delete content[name].deps;

    files[name] = content;
  }
});

tree.resolve().forEach(name => {
  Object.assign(seeds, files[name]);
});

mongoose.connect(config.db).connection.once('open', () => {
  seeder.seed(seeds).then(() => {
    mongoose.connection.close();
  }).catch(err => {
    console.err(err);
  });
});
