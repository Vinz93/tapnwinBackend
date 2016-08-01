import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';
import path from 'path';
import swaggerDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';

import config from './env';
import routes from '../server/routes';

// import cronJob from '../server/helpers/cron'; // eslint-disable-line no-unused-vars

const prefix = '/api/v1';
const app = express();
const spec = swaggerDoc({
  swaggerDefinition: {
    info: {
      title: 'Tapnwin',
      version: '1.0.0',
    },
    // basePath: '/tapnwin',
  },
  apis: ['./server/routes/**/*.js', './server/models/**/*.js', './server/controllers/**/*.js'],
});

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

app.use(prefix, routes);
app.use(`${prefix}/uploads`, express.static(path.join(config.root, 'uploads')));

app.use((err, req, res, next) => { // eslint-disable-line
  if (err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.name === 'MongoError' ||
      err.code === 11000)
    return res.status(400).json(err).end();

  console.error(err.stack);

  res.status(500).send(err);
});

swaggerTools.initializeMiddleware(spec, (middleware) => {
  app.use(middleware.swaggerUi({
    apiDocs: `${prefix}/docs.json`,
    swaggerUi: `${prefix}/docs`,
    // apiDocsPrefix: '/tapnwin2',
    // swaggerUiPrefix: '/tapnwin2',
  }));
});

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
