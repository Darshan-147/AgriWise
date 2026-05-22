/**
 * API Constants
 * Centralized API endpoints and configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth2/signup',
    LOGIN: '/auth2/login',
    LOGOUT: '/auth2/logout',
    GET_OTP: '/auth2/getotp',
    VERIFY_OTP: '/auth2/verifyotp',
    FORGOT_PASSWORD: '/auth2/forgotPassword',
    RESET_PASSWORD: '/auth2/resetPassword',
    GET_CURRENT_USER: '/auth2/getCurrentUser',
    UPDATE_PROFILE: '/auth2/updateUser',
    CHANGE_ROLE: '/auth2/change-role',
    DELETE_ACCOUNT: '/auth2/deleteMe',
  },

  // Credit & Risk
  CREDIT: {
    STORE_RISK_DATA: '/credit/store',
    GET_RISK_SCORES: '/credit/scores',
  },

  // Data
  DATA: {
    GET_VILLAGES: '/api/villages',
    GET_WEATHER: '/api/weather',
  },

  // Users
  USERS: {
    GET_ALL: '/users/all',
    GET_BY_ID: '/users',
  },

  AI: {
    CHAT: '/ai/chat',
  },
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second
