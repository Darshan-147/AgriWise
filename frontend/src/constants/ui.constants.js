/**
 * UI Constants
 * Colors, animations, breakpoints, etc.
 */

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1280,
};

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
};

export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 4000,
  LONG: 6000,
};

export const COLORS = {
  PRIMARY: '#10b981', // emerald-500
  PRIMARY_DARK: '#059669', // emerald-600
  SECONDARY: '#06b6d4', // cyan-500
  DANGER: '#ef4444', // red-500
  WARNING: '#f59e0b', // amber-500
  SUCCESS: '#10b981', // emerald-500
  INFO: '#3b82f6', // blue-500
};

export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  FARMER_DASHBOARD: '/farmer-dashboard',
  AGENT_DASHBOARD: '/agent-dashboard',
  AI_PREDICTION: '/personalised-ai',
  FORM: '/form',
};
