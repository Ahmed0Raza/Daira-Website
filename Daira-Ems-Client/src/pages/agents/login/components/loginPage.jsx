import React, { useRef } from 'react';
import { TextField, Button, Typography, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAgentAuth } from '../../auth/agentAuth';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';

const LoginComponent = () => {
  const navigate = useNavigate();
  const { login } = useAgentAuth();
  const theme = useTheme();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();

  // Formik form handling and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
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
        navigate('/agents/dashboard');
      } else {
        captchaRef.current.reset();
        values.email = '';
        values.password = '';
        setSubmitting(false);
      }
    },
  });

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
        <Typography variant="h4" sx={{ fontWeight: '600' }} gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="p" gutterBottom>
          Welcome back! Please enter your details.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600' }} gutterBottom>
          Sign In to your account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <Typography sx={{ fontSize: '14px' }}>Email address</Typography>
          <TextField
            name="email"
            placeholder="jean@jrs.com"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2, borderRadius: '8px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '14px' }}>Password</Typography>
          </Box>
          {/* Password Field */}
          <TextField
            name="password"
            placeholder="*******"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2, borderRadius: '8px' }}
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
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginComponent;
