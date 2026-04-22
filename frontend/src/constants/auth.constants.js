/**
 * Authentication Constants
 */

export const USER_ROLES = {
  FARMER: 'user',
  AGENT: 'admin',
};

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  TEMP_EMAIL: 'tempEmail',
  TEMP_ROLE: 'tempRole',
  USER_DATA: 'userData',
};

export const TOKEN_EXPIRY = '24h';

export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL: false,
};

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_LENGTH = 6;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_OTP: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGIN_REQUIRED: 'Please log in to continue',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',
};

export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully. Please verify your email.',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  OTP_SENT: 'OTP sent to your email',
  OTP_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};
