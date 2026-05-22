/**
 * Main App Component
 * Router configuration and route definitions
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from './constants';
import { authStorage } from './utils/storage';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FarmerDashboard from './pages/FarmerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import Home from './features/home/Home';
import Ai from './features/credit/Ai';
import Navbar from './features/home/Navbar';

/**
 * Protected Route Component
 * Validates JWT token and user role
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = authStorage.getToken();
  const role = authStorage.getRole();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate
        to={role === USER_ROLES.FARMER ? ROUTES.FARMER_DASHBOARD : ROUTES.AGENT_DASHBOARD}
      />
    );
  }

  return children;
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          path={ROUTES.FARMER_DASHBOARD}
          element={
            <ProtectedRoute allowedRole={USER_ROLES.FARMER}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.AGENT_DASHBOARD}
          element={
            <ProtectedRoute allowedRole={USER_ROLES.AGENT}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        {/* AI Prediction Route */}
        <Route path={ROUTES.AI_PREDICTION} element={<Ai />} />

        {/* Home Route */}
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* Catch all - Redirect home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </>
  );
};

export default App;
