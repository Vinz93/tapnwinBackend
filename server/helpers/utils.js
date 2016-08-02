import fs from 'fs';
import path from 'path';

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
