import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);
  const { forgotPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await forgotPassword({ email });

    if (result.success) {
      setAlert({
        type: 'success',
        message: 'Password reset link has been sent to your email.',
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setAlert({
        type: 'error',
        message: result.error || 'Failed to send reset link. Please try again.',
      });
    }
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="text-center mb-4">
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={error}
          required
        />

        <Button type="submit" variant="primary" fullWidth isLoading={loading}>
          Send Reset Link
        </Button>

        <Button type="button" variant="outline" fullWidth onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
