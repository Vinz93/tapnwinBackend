import httpStatus from 'http-status';

import ExtendableError from './extendable_error';

class APIError extends ExtendableError {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = true) {
    super(message, isPublic);

    this.status = status;
  }
}

export default APIError;
