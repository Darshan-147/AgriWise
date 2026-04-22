// src/pages/Login.jsx
import React, { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const [activeRole, setActiveRole] = useState('user');

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your account to access your dashboard"
      isLoginPage={true}
      activeRole={activeRole}
    >
      <LoginForm onRoleChange={handleRoleChange} />
    </AuthLayout>
  );
};

export default Login;
