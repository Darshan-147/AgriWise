// src/components/auth/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { gsap } from 'gsap';

const SignupForm = ({ onRoleChange }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role is 'user' (farmer)
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  // Notify parent component when role changes
  useEffect(() => {
    if (onRoleChange) {
      onRoleChange(formData.role);
    }
  }, [formData.role, onRoleChange]);

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

    if (!formData.username) {
      newErrors.username = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await signup(formData);

    if (result.success) {
      setAlert({
        type: 'success',
        message: 'Account created successfully! Please verify your email.',
      });

      // Store email and role for OTP verification
      localStorage.setItem('tempEmail', formData.email);
      localStorage.setItem('tempRole', formData.role);

      // Redirect to OTP verification page after a short delay
      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);
    } else {
      setAlert({
        type: 'error',
        message: result.error || 'Failed to create account. Please try again.',
      });
    }
  };

  // Handle role selection with animation
  const handleRoleSelect = (role) => {
    if (role === formData.role) return;

    // Animate the transition
    const container = document.querySelector('.role-selection-container');
    if (container) {
      gsap.fromTo(
        container,
        { opacity: 0.7, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }

    setFormData({
      ...formData,
      role,
    });
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.username}
          required
        />

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
          placeholder="Create a password (min. 8 characters)"
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
        />

        {/* Role selection */}
        <div className="mt-6 role-selection-container">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I want to register as:
          </label>
          <div className="flex space-x-4">
            <div
              onClick={() => handleRoleSelect('user')}
              className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 
                ${
                  formData.role === 'user'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  checked={formData.role === 'user'}
                  onChange={() => {}}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span
                  className={`ml-2 font-medium ${formData.role === 'user' ? 'text-green-700' : 'text-gray-700'}`}
                >
                  Farmer
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                I want to check my credit score and apply for loans
              </p>
            </div>

            <div
              onClick={() => handleRoleSelect('admin')}
              className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 
                ${
                  formData.role === 'admin'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  checked={formData.role === 'admin'}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`ml-2 font-medium ${formData.role === 'admin' ? 'text-blue-700' : 'text-gray-700'}`}
                >
                  Agent
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                I want to help farmers by reviewing their credit scores
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant={formData.role === 'user' ? 'primary' : 'secondary'}
          fullWidth
          isLoading={loading}
          className="mt-6"
        >
          Create {formData.role === 'user' ? 'Farmer' : 'Agent'} Account
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
