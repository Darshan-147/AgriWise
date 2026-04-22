import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import ResetPasswordForm from '../components/auth/ResetPassword';

const ResetPassword = () => {
  return (
    <AuthLayout title="Reset Password" subtitle="Create a new password for your account">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
