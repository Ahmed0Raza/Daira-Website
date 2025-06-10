import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Button, useTheme } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/inputs/customInput';
import { useUserAuth } from '../pages/user/auth/userAuth';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../utils/snackbarContextProvider';

const ForgotPassword = () => {
  const theme = useTheme();
  const { forgotPassword, verifyOTP } = useUserAuth();
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();

  const [showOtpField, setShowOtpField] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    let interval;
    if (showOtpField) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpField]);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(interval);
      navigate('/login');
    }
  }, [timer]);

  const handleForgotPassword = async (values) => {
    try {
      const { email, password } = values;
      const captchaValue = captchaRef.current.getValue();
      if (!captchaValue) {
        show('Please verify you are not a robot', 'error');
        setSubmitting(false);
        return;
      }
      await forgotPassword(email, password, captchaValue);
      setShowOtpField(true);
    } catch (error) {
      show(error.response.data.message, 'error');
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      const { otp } = values;
      const captchaValue = captchaRef.current.getValue();
      if (!captchaValue) {
        show('Please verify you are not a robot', 'error');
        setSubmitting(false);
        return;
      }
      await verifyOTP(otp, captchaValue);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <Box
      sx={{
        p: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
          p: '10px',
          height: 'auto',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          [theme.breakpoints.down('sm')]: {
            p: '10px',
          },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: '600', mb: 2 }}>
          Forgot Password
        </Typography>
        {showOtpField ? (
          <Formik
            initialValues={formData}
            validationSchema={Yup.object({
              otp: Yup.string().required('Required'),
            })}
            onSubmit={handleVerifyOTP}
          >
            {(formik) => (
              <Form>
                <InputField
                  name="otp"
                  label={`Enter OTP (${timer}s left)`}
                  fullWidth
                />
                <ReCAPTCHA
                  sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
                  ref={captchaRef}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  sx={{ mt: 2, height: '50px', borderRadius: '12px' }}
                >
                  Submit OTP
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={formData}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
              password: Yup.string()
                .required('Required')
                .matches(
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character'
                ),
              confirmPassword: Yup.string()
                .required('Required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            })}
            onSubmit={handleForgotPassword}
          >
            {(formik) => (
              <Form>
                <InputField name="email" label="Email" fullWidth />
                <InputField
                  name="password"
                  label="New Password"
                  type="password"
                  fullWidth
                />
                <InputField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                />
                <ReCAPTCHA
                  sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
                  ref={captchaRef}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  sx={{ mt: 2, height: '50px', borderRadius: '12px' }}
                >
                  Forgot Password
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
