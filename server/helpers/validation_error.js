import httpStatus from 'http-status';

import ExtendableError from './extendable_error';
import APIError from './api_error';

class ValidationError extends ExtendableError {
  constructor(message, isPublic = true) {
    super(message, isPublic);
  }

  toAPIError() {
    return new APIError(this.message, httpStatus.BAD_REQUEST, this.isPublic);
  }
}

export default ValidationError;
