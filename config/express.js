import express from 'express';
import validation from 'express-validation';
import httpStatus from 'http-status';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';
import path from 'path';
import swaggerDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';
import APIError from '../server/helpers/api_error';

import config from './env';
import routes from '../server/routes';
// import cronJob from '../server/helpers/cron'; // eslint-disable-line no-unused-vars

const app = express();
const spec = swaggerDoc({
  swaggerDefinition: {
    info: {
      title: 'Tapnwin',
      version: '1.0.0',
    },
    basePath: config.basePath,
  },
  apis: [
    'server/routes/**/*.js',
    'server/models/**/*.js',
    'server/controllers/**/*.js',
  ],
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

app.use(config.path, routes);
app.use('/uploads', express.static(path.join(config.root, 'uploads')));

/* app.use((err, req, res, next) => { // eslint-disable-line
  if (err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.name === 'MongoError' ||
      err.code === 11000)
    return res.status(400).json(err).end();

  res.status(500).send(err);
});*/

app.use((err, req, res, next) => {
  if (err instanceof validation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status);

    return next(error);
  } else if (!(err instanceof APIError))
    return next(new APIError(err.message, err.status, err.isPublic));

  return next(err);
});

app.use((req, res, next) => next(new APIError('Endpoint not found', httpStatus.NOT_FOUND)));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
  });
});

swaggerTools.initializeMiddleware(spec, (middleware) => {
  app.use(middleware.swaggerUi({
    apiDocs: `${config.path}docs.json`,
    swaggerUi: `${config.path}docs`,
    apiDocsPrefix: config.basePath,
    swaggerUiPrefix: config.basePath,
  }));
});

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
