import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { authStorage } from '../../utils/storage';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);
  const { verifyOtp, requestOtp, loading } = useAuth();
  const navigate = useNavigate();

  const email = authStorage.getTempEmail() || localStorage.getItem('tempEmail');
  const verificationMeta = authStorage.getUserData();

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    // Start countdown for resend button
    let timer;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [countdown, resendDisabled, email, navigate]);

  const handleChange = (e) => {
    setOtp(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    const result = await verifyOtp(otp);

    if (result.success) {
      setAlert({
        type: 'success',
        message: 'Email verified successfully!',
      });

      // Clear temporary email
      authStorage.removeTempEmail();
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('tempRole');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (email) {
      const result = await requestOtp(email);

      if (result.success) {
        setAlert({
          type: 'success',
          message: 'OTP resent successfully!',
        });

        // Reset countdown
        setCountdown(60);
        setResendDisabled(true);
      } else {
        setAlert({
          type: 'error',
          message: result.error || 'Failed to resend OTP. Please try again.',
        });
      }
    }
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="text-center mb-4">
        <p className="text-gray-600">
          We've sent a verification code to
          <br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>
        {verificationMeta?.devOtp && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800">
            <p className="font-medium">Development OTP: {verificationMeta.devOtp}</p>
            <p className="mt-1">
              {verificationMeta.emailWarning ||
                'Email delivery is not configured. Add Gmail SMTP credentials to backend/.env.'}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          id="otp"
          name="otp"
          value={otp}
          onChange={handleChange}
          placeholder="Enter 6-digit code"
          error={error}
          required
        />

        <Button type="submit" variant="primary" fullWidth isLoading={loading}>
          Verify Email
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className={`font-medium ${
              resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:underline'
            }`}
          >
            {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
