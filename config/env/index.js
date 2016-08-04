import path from 'path';
import development from './development';
import production from './production';

const defaults = {
  root: path.join(__dirname, '../..'),
};

const config = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
}[process.env.NODE_ENV || 'development'];

export default config;
