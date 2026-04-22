/**
 * Error Handler Utility
 * Centralized error handling and formatting
 */

import { ERROR_MESSAGES } from '../constants';
import { logger } from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @returns {object} Formatted error object
 */
export const handleError = (error) => {
  logger.error('Error caught:', error);

  // Network error
  if (!window.navigator.onLine) {
    return {
      status: 'error',
      message: ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 0,
    };
  }

  // Axios error
  if (error.response) {
    const { status, data } = error.response;
    return {
      status: 'error',
      message: data?.message || getErrorMessageByStatus(status),
      statusCode: status,
      details: data?.details,
    };
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return {
      status: 'error',
      message: 'Request timeout. Please try again.',
      statusCode: 408,
    };
  }

  // Custom AppError
  if (error instanceof AppError) {
    return {
      status: 'error',
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Generic error
  return {
    status: 'error',
    message: error.message || ERROR_MESSAGES.SERVER_ERROR,
    statusCode: error.statusCode || 500,
  };
};

/**
 * Get error message based on HTTP status code
 */
const getErrorMessageByStatus = (status) => {
  const statusMessages = {
    400: 'Bad request. Please check your input.',
    401: ERROR_MESSAGES.LOGIN_REQUIRED,
    403: ERROR_MESSAGES.UNAUTHORIZED,
    404: 'Resource not found.',
    408: 'Request timeout. Please try again.',
    429: 'Too many requests. Please wait before trying again.',
    500: ERROR_MESSAGES.SERVER_ERROR,
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  return statusMessages[status] || ERROR_MESSAGES.SERVER_ERROR;
};

export default handleError;
