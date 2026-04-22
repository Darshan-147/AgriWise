/**
 * Helper Utilities
 * Common helper functions
 */

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Format date
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
};

/**
 * Format time
 */
export const formatTime = (date, format = 'HH:mm:ss') => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format.replace('HH', hours).replace('mm', minutes).replace('ss', seconds);
};

/**
 * Truncate string
 */
export const truncateString = (str, length = 50) => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

/**
 * Capitalize string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Merge objects
 */
export const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};

/**
 * Clone object deeply
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sleep function (promise-based delay)
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
};

export default {
  debounce,
  throttle,
  formatDate,
  formatTime,
  truncateString,
  capitalize,
  getInitials,
  isEmpty,
  mergeObjects,
  deepClone,
  sleep,
  getQueryParam,
};
