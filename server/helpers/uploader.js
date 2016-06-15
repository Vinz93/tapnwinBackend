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

export default function (asset, fileName) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(config.root, 'uploads', asset));
    },
    filename(req, file, cb) {
      const filename = `${uuid.v4()}.${mime.extension(file.mimetype)}`;
      cb(null, filename);
    },
  });

  return multer({ storage }).single(fileName);
}
