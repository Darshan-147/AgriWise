/**
 * Logger Utility
 * Centralized logging with different levels
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const isDevelopment = import.meta.env.MODE === 'development';

const getTimestamp = () => new Date().toISOString();

const log = (level, message, data = null) => {
  if (!isDevelopment && level === LOG_LEVELS.DEBUG) return;

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(logMessage, data);
      break;
    case LOG_LEVELS.INFO:
      console.info(logMessage, data);
      break;
    case LOG_LEVELS.WARN:
      console.warn(logMessage, data);
      break;
    case LOG_LEVELS.ERROR:
      console.error(logMessage, data);
      break;
    default:
      console.log(logMessage, data);
  }
};

export const logger = {
  debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
  info: (message, data) => log(LOG_LEVELS.INFO, message, data),
  warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
  error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
};

export default logger;
