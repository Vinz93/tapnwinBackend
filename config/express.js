import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import methodOverride from 'method-override';
import uuid from 'node-uuid';
import mime from 'mime';
import nodemailer from 'nodemailer';
import path from 'path';

import config from './env';
import routes from '../server/routes';

const app = express();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(config.root, 'uploads'));
  },
  filename(req, file, cb) {
    const filename = `${uuid.v4()}.${mime.extension(file.mimetype)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage }).single('file');

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

app.post('/test-upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(req.file);
      console.log(err);
      return res.status(400).send(err);
    }
    res.send('Profile ok');
  });

  // console.log('req.file', req.file);
  // console.log('req.body', req.body);
});

app.use('/api/v1', routes);

app.locals.config = config;
app.locals.mailer = nodemailer.createTransport(config.mailer);

export default app;
