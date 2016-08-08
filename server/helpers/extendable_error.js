class ExtendableError extends Error {
  constructor(message, isPublic) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export default ExtendableError;
