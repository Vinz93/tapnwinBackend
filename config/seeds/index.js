const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');
const path = require('path');
const walkSync = require('walk-sync');

const DepTree = require('deptree');
const config = require('../env');
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
