import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import config from './env';
import commonRoutes from '../server/routes/common';

const app = express();

app.disable('x-powered-by');

if (config.env === 'development') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());

app.use(cors());

app.use('/api/v1', commonRoutes); // Common routes
// app.use('/api/v1', designRoutes); // Design routes

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
