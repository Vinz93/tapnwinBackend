/**
 * @author Juan Sanchez
 * @description File uploader
 * @lastModifiedBy Juan Sanchez
 */

import multer from 'multer';
import uuid from 'node-uuid';
import mime from 'mime';
import path from 'path';
import config from './../../config/env';

export default function (name) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(config.root, 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
    },
  });

  return multer({ storage }).single(name);
}
