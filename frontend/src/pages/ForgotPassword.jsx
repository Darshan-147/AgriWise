import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import ForgotPasswordForm from '../components/auth/ForgotPassword';

const ForgotPassword = () => {
  return (
    <AuthLayout title="Forgot Password" subtitle="We'll help you reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
