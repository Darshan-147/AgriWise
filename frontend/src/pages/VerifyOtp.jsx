import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import OtpVerification from '../components/auth/OtpVerification';

const VerifyOtp = () => {
  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Enter the verification code sent to your email"
    >
      <OtpVerification />
    </AuthLayout>
  );
};

export default VerifyOtp;
