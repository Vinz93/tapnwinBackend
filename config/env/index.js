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
    name: 'dyg', // dyg = Diseña Y Gana
    id: '0001',
  }, {
    name: 'vdlg', // vdlg = Voz De La Gente
    id: '0002',
  }, {
    name: 'm3', // m3 = Match3
    id: '0003',
  }, {
    name: 'ddt', // ddt = Dueño De Tienda
    id: '0004',
  }],
};

const config = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
}[process.env.NODE_ENV || 'development'];

export default config;
