import path from 'path';
import development from './development';
import production from './production';
import testing from './testing';

const defaults = {
  root: path.join(__dirname, '../..'),
};

const config = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
  testing: Object.assign(testing, defaults),
}[process.env.NODE_ENV || 'development'];

export default config;
