import path from 'path';
import development from './development';
import production from './production';

const defaults = {
  root: path.join(__dirname, '../..'),
  host: 'http://tapnwin.ludopia.net/api/v1/',
  limit(limit, value) {
    return !isNaN(limit) ? parseInt(limit, 10) : value || 20;
  },
  offset(offset, value) {
    return !isNaN(offset) ? parseInt(offset, 10) : value || 0;
  },
};

const config = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
}[process.env.NODE_ENV || 'development'];

export default config;
