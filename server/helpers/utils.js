import fs from 'fs';
import path from 'path';
import multer from 'multer';
import uuid from 'node-uuid';
import mime from 'mime';

export const paginate = {
  limit(limit, value) {
    return !isNaN(limit) ? parseInt(limit, 10) : value || 20;
  },
  offset(offset, value) {
    return !isNaN(offset) ? parseInt(offset, 10) : value || 0;
  },
};

export function unlinkSync(config, url) {
  let host = config.host;

  if (config.basePort)
    host = `${host}:${config.basePort}`;

  host = `${host}/uploads`;

  if (path.dirname(url) === host) {
    const dest = path.join(config.root, `/uploads/${path.basename(url)}`);

    if (fs.existsSync(dest))
      fs.unlinkSync(dest);
  }
}

export function upload(name) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(req.app.locals.config.root, 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
    },
  });

  return multer({ storage }).single(name);
}
