'use client';

import { useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';
import { useInvitationAuth } from '../../auth/invitationsAuth';
import styled from 'styled-components';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

// Styled components for enhanced visual appeal
const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

const FormTitle = styled.h4`
  color: #f59e0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const FormHeader = styled.h5`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    border-radius: 2px;
  }
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    background-color: white;
  }

  &.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #d1d5db, #9ca3af);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RecaptchaWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const LoginComponent = () => {
  const navigate = useNavigate();
  const { login } = useInvitationAuth();
  const theme = useTheme();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();
  const invitationRoute = '/coolboi69/invitation';

  // Formik form handling and validation
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const captchaValue = captchaRef.current.getValue();
      if (!captchaValue) {
        show('Please verify you are not a robot', 'error');
        setSubmitting(false);
        return;
      }

      const dataToSend = {
        ...values,
        recaptchaToken: captchaValue,
      };
      const loginSuccess = await login(dataToSend);
      if (loginSuccess) {
        navigate(`${invitationRoute}/`);
      } else {
        setSubmitting(false);
      }
    },
  });

  const handleForgetPasswordClick = () => {
    navigate('/forgotpassword');
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
      <FormContainer>
        <FormTitle>Team Invitations</FormTitle>
        <FormSubtitle>Welcome Back! Please enter your details.</FormSubtitle>
        <FormHeader>Sign In to your account</FormHeader>

        <form onSubmit={formik.handleSubmit}>
          <InputLabel htmlFor="username">Username</InputLabel>
          <InputWrapper>
            <StyledInput
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.username && formik.errors.username ? 'error' : ''
              }
            />
            {formik.touched.username && formik.errors.username && (
              <ErrorMessage>{formik.errors.username}</ErrorMessage>
            )}
          </InputWrapper>

          <InputLabel htmlFor="password">Password</InputLabel>
          <InputWrapper>
            <StyledInput
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.password && formik.errors.password ? 'error' : ''
              }
            />
            {formik.touched.password && formik.errors.password && (
              <ErrorMessage>{formik.errors.password}</ErrorMessage>
            )}
          </InputWrapper>

          <RecaptchaWrapper>
            <ReCAPTCHA
              sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
              ref={captchaRef}
            />
          </RecaptchaWrapper>

          <SubmitButton type="submit" disabled={formik.isSubmitting}>
            <FiLogIn size={18} />
            Sign In
          </SubmitButton>
        </form>
      </FormContainer>
    </Box>
  );
};

export default LoginComponent;
