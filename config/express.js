import path from 'path';
import express from 'express';
import validation from 'express-validation';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import nodemailer from 'nodemailer';
import swaggerDoc from 'swagger-jsdoc';
import swaggerTools from 'swagger-tools';

import config from './env';
import routes from '../server/routes';
import APIError from '../server/helpers/api_error';
import ValidationError from '../server/helpers/validation_error';
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

if (config.env === 'development' || config.env === 'testing') {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
}

app.use(bodyParser.json());
app.use(cors());

app.use(config.path, routes);
app.use('/uploads', express.static(path.join(config.root, 'uploads')));

app.use((err, req, res, next) => {
  let message;

  if (err instanceof ValidationError)
    return next(err.toAPIError());
  else if (err instanceof mongoose.Error.ValidationError) {
    message = Object.keys(err.errors).map(key => err.errors[key].message).join(' and ');

    return next(new APIError(message, httpStatus.BAD_REQUEST));
  } else if (err instanceof validation.ValidationError) {
    message = err.errors.map(error => error.messages.join('. ')).join(' and ');

    return next(new APIError(message, err.status));
  } else if (!(err instanceof APIError))
    return next(new APIError(err.message, err.status, err.isPublic));

  return next(err);
});

swaggerTools.initializeMiddleware(spec, (middleware) => {
  app.use(middleware.swaggerUi({
    apiDocs: `${config.path}docs.json`,
    swaggerUi: `${config.path}docs`,
    apiDocsPrefix: config.basePath,
    swaggerUiPrefix: config.basePath,
  }));

  app.use((req, res, next) => next(new APIError('Endpoint not found', httpStatus.NOT_FOUND)));

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env === 'development' ? err.stack : {},
    });
  });
});

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
