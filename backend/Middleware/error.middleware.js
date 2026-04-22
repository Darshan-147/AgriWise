import ApiError from "../utils/ApiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error";

  if (res.headersSent) {
    return next(error);
  }

  const payload = {
    status: "error",
    message,
  };

  if (error.errors?.length) {
    payload.errors = error.errors;
  }

  if (process.env.NODE_ENV !== "production" && error.stack) {
    payload.stack = error.stack;
  }

  return res.status(statusCode).json(payload);
};
