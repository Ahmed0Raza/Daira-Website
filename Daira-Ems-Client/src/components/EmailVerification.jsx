import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import styled from '@mui/material/styles/styled';
import CreateAxiosInstance from '../utils/axiosInstance';
import img from '../components/assets/tick.png';

const CustomButton = styled(Button)({
  backgroundColor: '#fc8b00',
  color: 'white',
  '&:hover': {
    backgroundColor: '#fc8b00',
    color: 'white',
  },
  border: '1px solid #fc8b00',
  borderRadius: '4px',
  padding: '12px 30px',
  transition: 'background-color 0.3s, color 0.3s',
  marginBottom: '10px',
});

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const location = useLocation();
  const axios = CreateAxiosInstance();

  const verifyEmail = async (token) => {
    setButtonClicked(true);
    try {
      const response = await axios.get(`/backend/auth/verify-email?token=${token}`);
      setVerificationStatus(response.data || 'Email verified successfully! You are now registered and can log in.');
      setIsVerified(true);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus(
        error.response?.data || 
        error.response?.data?.message || 
        'Verification failed. Please try again or contact support.'
      );
      setIsVerified(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token && !buttonClicked) {
      verifyEmail(token);
    }
  }, [location.search]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <img
        src={img}
        alt="Your Alt Text"
        style={{ width: '200px', height: '200px', marginBottom: '20px' }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#fc8b00',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontSize: '30px',
        }}
      >
        {verificationStatus || 'Click the button below to verify your email.'}
      </Typography>

      {!buttonClicked && (
        <CustomButton
          onClick={() => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');
            if (token) {
              verifyEmail(token);
            } else {
              setVerificationStatus('No token provided.');
            }
          }}
          disabled={buttonClicked}
        >
          Verify Email
        </CustomButton>
      )}
      {verificationStatus.startsWith('Email verified successfully') && (
        <div>
          <p>You may now log in to your account.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
