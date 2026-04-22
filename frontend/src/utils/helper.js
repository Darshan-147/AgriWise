// src/utils/helper.js

import { gsap } from 'gsap';

/**
 * Form Validation Functions
 */
export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
  isValidPassword: (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },

  // Name validation (at least 2 characters, letters only)
  isValidName: (name) => {
    return name.trim().length >= 2 && /^[A-Za-z\s]+$/.test(name);
  },

  // OTP validation (6 digits)
  isValidOtp: (otp) => {
    return /^\d{6}$/.test(otp);
  },

  // Required field validation
  isRequired: (value) => {
    return value && value.trim().length > 0;
  },

  // Match fields (for password confirmation)
  doFieldsMatch: (field1, field2) => {
    return field1 === field2;
  },
};

/**
 * Token Management
 */
export const tokenManager = {
  // Save token to localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem('token');
  },

  // Set user role
  setRole: (role) => {
    localStorage.setItem('role', role);
  },

  // Get user role
  getRole: () => {
    return localStorage.getItem('role');
  },

  // Save temporary email (for OTP verification)
  setTempEmail: (email) => {
    localStorage.setItem('tempEmail', email);
  },

  // Get temporary email
  getTempEmail: () => {
    return localStorage.getItem('tempEmail');
  },

  // Clear temporary email
  clearTempEmail: () => {
    localStorage.removeItem('tempEmail');
  },
};

/**
 * GSAP Animation Helpers
 */
export const animations = {
  // Fade in element
  fadeIn: (element, delay = 0, duration = 0.5) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
      }
    );
  },

  // Fade out element
  fadeOut: (element, onComplete, duration = 0.3) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      ease: 'power2.in',
      onComplete,
    });
  },

  // Stagger multiple elements
  stagger: (elements, delay = 0, staggerTime = 0.1, duration = 0.4) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger: staggerTime,
        ease: 'power2.out',
      }
    );
  },

  // Pulse animation (for buttons, notifications)
  pulse: (element, scale = 1.05, duration = 0.3) => {
    return gsap.to(element, {
      scale,
      duration,
      repeat: 1,
      yoyo: true,
      ease: 'power2.inOut',
    });
  },

  // Shake animation (for error feedback)
  shake: (element, distance = 10, duration = 0.1) => {
    return gsap.to(element, {
      x: distance,
      duration,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut',
    });
  },

  // Page transition in
  pageTransitionIn: (container) => {
    return gsap.fromTo(
      container,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  },

  // Page transition out
  pageTransitionOut: (container, onComplete) => {
    return gsap.to(container, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete,
    });
  },
};

/**
 * Form Handling Helpers
 */
export const formHelpers = {
  // Create form error object
  createErrorObject: (fields) => {
    const errors = {};
    fields.forEach((field) => {
      errors[field] = '';
    });
    return errors;
  },

  // Reset form fields
  resetForm: (setFormData, initialState) => {
    setFormData(initialState);
  },

  // Format form data for API
  prepareFormData: (formData) => {
    // Create a new object to avoid modifying the original
    const prepared = { ...formData };

    // Trim string values
    Object.keys(prepared).forEach((key) => {
      if (typeof prepared[key] === 'string') {
        prepared[key] = prepared[key].trim();
      }
    });

    return prepared;
  },
};

/**
 * Error Handling
 */
export const errorHandler = {
  // Parse API error response
  parseError: (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      return error.response.data.message || 'Something went wrong';
    } else if (error.request) {
      // Request was made but no response was received
      return 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      return error.message || 'An unexpected error occurred';
    }
  },

  // Handle authentication errors
  handleAuthError: (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      tokenManager.removeToken();
      window.location.href = '/login';
      return 'Your session has expired. Please log in again.';
    }
    return errorHandler.parseError(error);
  },
};

/**
 * Date & Time Formatting
 */
export const dateFormatter = {
  // Format date to readable string
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Format date with time
  formatDateTime: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    if (!date) return '';

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return rtf.format(-diffInMinutes, 'minute');
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return rtf.format(-diffInHours, 'hour');
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return rtf.format(-diffInDays, 'day');
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return rtf.format(-diffInMonths, 'month');
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year');
  },
};

/**
 * Device & Browser Detection
 */
export const deviceDetector = {
  // Check if mobile device
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // Check if iOS device
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  // Check if Safari browser
  isSafari: () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
};

/**
 * Debounce & Throttle Functions
 */
// Debounce function - useful for search inputs, window resize
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function - useful for scroll events
export const throttle = (func, limit = 300) => {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Miscellaneous Helpers
 */
// Generate random string (useful for keys, temporary IDs)
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Check if object is empty
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

// Safe JSON parse
export const safeJsonParse = (jsonString, fallback = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return fallback;
  }
};
