/**
 * Storage Utilities
 * Centralized local storage operations
 */

import { AUTH_STORAGE_KEYS } from '../constants';

/**
 * Save item to localStorage
 */
export const setStorageItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
};

/**
 * Get item from localStorage
 */
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to retrieve ${key} from storage:`, error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error);
  }
};

/**
 * Clear all storage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};

/**
 * Auth-specific storage operations
 */
export const authStorage = {
  setToken: (token) => setStorageItem(AUTH_STORAGE_KEYS.TOKEN, token),
  getToken: () => getStorageItem(AUTH_STORAGE_KEYS.TOKEN),
  removeToken: () => removeStorageItem(AUTH_STORAGE_KEYS.TOKEN),

  setRole: (role) => setStorageItem(AUTH_STORAGE_KEYS.ROLE, role),
  getRole: () => getStorageItem(AUTH_STORAGE_KEYS.ROLE),
  removeRole: () => removeStorageItem(AUTH_STORAGE_KEYS.ROLE),

  setTempEmail: (email) => setStorageItem(AUTH_STORAGE_KEYS.TEMP_EMAIL, email),
  getTempEmail: () => getStorageItem(AUTH_STORAGE_KEYS.TEMP_EMAIL),
  removeTempEmail: () => removeStorageItem(AUTH_STORAGE_KEYS.TEMP_EMAIL),

  setUserData: (data) => setStorageItem(AUTH_STORAGE_KEYS.USER_DATA, data),
  getUserData: () => getStorageItem(AUTH_STORAGE_KEYS.USER_DATA),
  removeUserData: () => removeStorageItem(AUTH_STORAGE_KEYS.USER_DATA),

  clearAuth: () => {
    removeStorageItem(AUTH_STORAGE_KEYS.TOKEN);
    removeStorageItem(AUTH_STORAGE_KEYS.ROLE);
    removeStorageItem(AUTH_STORAGE_KEYS.USER_DATA);
  },
};

export default {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  authStorage,
};
