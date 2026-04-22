/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../utils/storage';
import { handleError, logger } from '../utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Check if user is already logged in on mount
   */
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = authStorage.getToken();
      if (token) {
        try {
          const { data } = await authService.getCurrentUser();
          setUser(data.data);
        } catch (err) {
          logger.error('Failed to fetch current user:', err);
          authStorage.clearAuth();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  /**
   * User login
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authService.login(credentials);

      if (data.notVerified) {
        authStorage.setTempEmail(credentials.email);
        navigate('/verify-otp');
        return { notVerified: true };
      }

      authStorage.setToken(data.token);
      authStorage.setRole(data.role);

      const userData = await authService.getCurrentUser();
      setUser(userData.data.data);
      logger.info('User logged in successfully');

      return { success: true, role: data.role };
    } catch (err) {
      const errorData = handleError(err);
      setError(errorData.message);
      logger.error('Login error:', errorData);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User registration
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authService.signup(userData);
      authStorage.setTempEmail(userData.email);
      logger.info('Signup successful, OTP sent');
      return { success: true };
    } catch (err) {
      const errorData = handleError(err);
      setError(errorData.message);
      logger.error('Signup error:', errorData);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User logout
   */
  const logout = () => {
    authStorage.clearAuth();
    setUser(null);
    logger.info('User logged out');
    navigate('/login');
  };

  /**
   * Request OTP
   */
  const requestOtp = async (email) => {
    try {
      setLoading(true);
      await authService.getOtp({ emailId: email });
      logger.info('OTP sent to email');
      return { success: true };
    } catch (err) {
      const errorData = handleError(err);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP
   */
  const verifyOtp = async (otp) => {
    try {
      setLoading(true);
      const { data } = await authService.verifyOtp({ userOtp: otp });
      logger.info('OTP verified successfully');
      return { success: data.success };
    } catch (err) {
      const errorData = handleError(err);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const { data } = await authService.forgotPassword(email);
      logger.info('Password reset email sent');
      return { success: data.status };
    } catch (err) {
      const errorData = handleError(err);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (token, passwords) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, passwords);
      logger.info('Password reset successfully');
      return { success: true };
    } catch (err) {
      const errorData = handleError(err);
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        requestOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
