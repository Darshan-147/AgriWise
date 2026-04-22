/**
 * Validation Utilities
 * Email, password, form validation, etc.
 */

import { PASSWORD_RULES, ERROR_MESSAGES } from '../constants';

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < PASSWORD_RULES.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`);
  }

  if (PASSWORD_RULES.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_RULES.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_RULES.REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_RULES.REQUIRE_SPECIAL && !/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate passwords match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate OTP format
 */
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone) => {
  // Indian phone number format
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Validate required field
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Generic form validation
 */
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `Invalid ${field} format`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateOTP,
  validatePhoneNumber,
  validateRequired,
  validateForm,
};
