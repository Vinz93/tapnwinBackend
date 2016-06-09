import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';
import path from 'path';

import config from './env';
import routes from '../server/routes';

import cronJob from '../server/helpers/cron'; // eslint-disable-line no-unused-vars

const app = express();

app.disable('x-powered-by');

app.use(methodOverride('X-HTTP-Method-Override'));

if (config.env === 'development') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());

app.use(cors());

app.use('/api/v1', routes);
app.use('/api/v1/uploads', express.static(path.join(config.root, 'uploads')));

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
