import { useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';
import { useAccommodationAuth } from '../../auth/accommodationAuth';

const LoginComponent = () => {
  const navigate = useNavigate();
  const { login } = useAccommodationAuth();
  const theme = useTheme();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
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
      console.log('Login result:', loginSuccess);
      if (loginSuccess) {
        navigate('/accommodation/dashboard');
      } else {
        show('Login failed. Please check your credentials.', 'error');
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
          Accommodation Login
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome back! Please enter your details.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600' }} gutterBottom>
          Sign In to your account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Typography sx={{ fontSize: '14px' }}>Username</Typography>
          <TextField
            name="username"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ mb: 2, borderRadius: '8px' }}
          />
          <Typography sx={{ fontSize: '14px' }}>Password</Typography>
          <TextField
            name="password"
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
            disabled={formik.isSubmitting}
          >
            Sign In
          </Button>
          <Button
            variant="text"
            onClick={handleForgetPasswordClick}
            sx={{ mt: 1 }}
          >
            Forgot Password?
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginComponent;
