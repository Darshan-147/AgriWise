/**
 * API Service
 * Centralized Axios instance with interceptors and auth services
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from '../constants/api.constants';
import { authStorage } from '../utils/storage';
import { handleError, logger } from '../utils';

/**
 * Create Axios instance with default config
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug('API Request:', { url: config.url, method: config.method });
    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors & token refresh
 */
api.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', { url: response.config.url, status: response.status });
    return response;
  },
  (error) => {
    const errorResponse = handleError(error);

    // If unauthorized, clear auth and redirect to login
    if (error.response?.status === 401) {
      authStorage.clearAuth();
      window.location.href = '/login';
    }

    logger.error('API Error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

/**
 * Auth Services
 */
export const authService = {
  signup: (userData) => api.post(API_ENDPOINTS.AUTH.SIGNUP, userData),
  login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  forgotPassword: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (token, passwords) =>
    api.patch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, passwords),
  getOtp: (emailId) => api.post(API_ENDPOINTS.AUTH.GET_OTP, { emailId }),
  verifyOtp: (userOtp) => api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { userOtp }),
  getCurrentUser: () => api.get(API_ENDPOINTS.AUTH.GET_CURRENT_USER),
  updateProfile: (formData) => api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, formData),
  changeRole: (role) => api.patch(API_ENDPOINTS.AUTH.CHANGE_ROLE, { role }),
  deleteAccount: () => api.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT),
};

/**
 * Credit/Risk Services
 */
export const creditService = {
  storeRiskData: (riskData) => api.post(API_ENDPOINTS.CREDIT.STORE_RISK_DATA, riskData),
  getRiskScores: () => api.get(API_ENDPOINTS.CREDIT.GET_RISK_SCORES),
};

/**
 * Data Services
 */
export const dataService = {
  getVillages: () => api.get(API_ENDPOINTS.DATA.GET_VILLAGES),
  getWeather: () => api.get(API_ENDPOINTS.DATA.GET_WEATHER),
};

/**
 * User Services
 */
export const userService = {
  getAll: () => api.get(API_ENDPOINTS.USERS.GET_ALL),
  getById: (userId) => api.get(`${API_ENDPOINTS.USERS.GET_BY_ID}/${userId}`),
};

export default api;
