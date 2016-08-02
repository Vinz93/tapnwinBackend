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

export default function (fileName) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      console.log('fdsf');
      cb(null, path.join(config.root, 'uploads'));
    },
    filename(req, file, cb) {
      const filename = `${uuid.v4()}.${mime.extension(file.mimetype)}`;
      console.log(filename);
      cb(null, filename);
    },
  });

  return multer({ storage }).single(fileName);
}
