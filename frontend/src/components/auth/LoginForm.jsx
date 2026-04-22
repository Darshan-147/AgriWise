// src/components/auth/LoginForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { gsap } from 'gsap';

const LoginForm = ({ onRoleChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [activeRole, setActiveRole] = useState('user'); // Default to farmer login
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const formRef = useRef(null);
  const tabsRef = useRef(null);

  // Notify parent component when role changes
  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(activeRole);
    }
  }, [activeRole, onRoleChange]);

  // Animation for tab switching
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await login(formData);

    if (result.success) {
      // Check if the user's role matches the selected role tab
      if (result.role === 'user' && activeRole === 'user') {
        navigate('/farmer-dashboard');
      } else if (result.role === 'admin' && activeRole === 'admin') {
        navigate('/agent-dashboard');
      } else {
        // If roles don't match, show an error
        setAlert({
          type: 'error',
          message: `You're trying to log in as a ${
            activeRole === 'user' ? 'Farmer' : 'Agent'
          }, but your account is registered as a ${result.role === 'user' ? 'Farmer' : 'Agent'}.`,
        });
      }
    } else if (result.notVerified) {
      localStorage.setItem('tempEmail', formData.email);
      navigate('/verify-otp');
    } else {
      setAlert({
        type: 'error',
        message: result.error || 'Login failed. Please check your credentials.',
      });
    }
  };

  // Handle role tab click with animation
  const handleRoleTabClick = (role) => {
    if (role === activeRole) return;

    // Animate the tab indicator
    const indicator = document.querySelector('.tab-indicator');
    if (indicator) {
      const targetPosition = role === 'user' ? '0%' : '50%';
      gsap.to(indicator, {
        left: targetPosition,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }

    setActiveRole(role);

    // Clear any previous errors when switching tabs
    setErrors({});
    setAlert(null);
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Role selection tabs */}
      <div ref={tabsRef} className="relative mb-6 rounded-lg bg-gray-100 p-1">
        <div className="flex">
          <button
            onClick={() => handleRoleTabClick('user')}
            className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-200 ${
              activeRole === 'user' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Farmer Login
          </button>
          <button
            onClick={() => handleRoleTabClick('admin')}
            className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-200 ${
              activeRole === 'admin' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Agent Login
          </button>

          {/* Animated tab indicator */}
          <div
            className="tab-indicator absolute top-1 bottom-1 w-1/2 rounded-md transition-all duration-200"
            style={{
              left: activeRole === 'user' ? '0%' : '50%',
              backgroundColor: activeRole === 'user' ? '#16a34a' : '#2563eb',
            }}
          ></div>
        </div>
      </div>

      <div ref={formRef} key={activeRole} className="transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            required
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant={activeRole === 'user' ? 'primary' : 'secondary'}
            fullWidth
            isLoading={loading}
          >
            Log In as {activeRole === 'user' ? 'Farmer' : 'Agent'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
