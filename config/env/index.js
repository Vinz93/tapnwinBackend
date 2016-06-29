import path from 'path';
import development from './development';
import production from './production';

const defaults = {
  root: path.join(__dirname, '../..'),
  host: 'https://52.37.117.104/tapnwin/api/v1/',
  paginate: {
    limit(limit, value) {
      return !isNaN(limit) ? parseInt(limit, 10) : value || 20;
    },
    offset(offset, value) {
      return !isNaN(offset) ? parseInt(offset, 10) : value || 0;
    },
  },
  games: [{
    name: 'design',
    id: '0001',
  }, {
    name: 'voice',
    id: '0002',
  }, {
    name: 'match3',
    id: '0003',
  }, {
    name: 'owner',
    id: '0004',
  }],
};

const config = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
}[process.env.NODE_ENV || 'development'];

export default config;
