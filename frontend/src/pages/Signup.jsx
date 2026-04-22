// src/pages/Signup.jsx
import React, { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import SignupForm from '../components/auth/SignupForm';

const Signup = () => {
  const [activeRole, setActiveRole] = useState('user');

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to join our credit scoring platform"
      activeRole={activeRole}
    >
      <SignupForm onRoleChange={handleRoleChange} />
    </AuthLayout>
  );
};

export default Signup;
