class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    if (typeof statusCode === "string") {
      stack = errors || "";
      errors = Array.isArray(message) ? message : [];
      message = statusCode;
      statusCode = 500;
    }

    super(message);
    this.statusCode = Number(statusCode) || 500;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [];

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
