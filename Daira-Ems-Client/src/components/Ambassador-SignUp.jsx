import React, { useRef } from 'react';
import { Grid, Typography, Box, Button, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Dropdown from '../components/inputs/dropDownField';
import * as Yup from 'yup';
import FileInput from './inputs/fileInput';
import InputField from './inputs/customInput';
import ProfileImg from '../resources/Daira2024-Logo-White-TransparentBG.png';
import Logo from '../resources/Horizontal-Tagline.png';
import { useAmbassador } from '../service/ambassadorService';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../utils/snackbarContextProvider';

const AmbassadorSignup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { signupAmbassador, verifyToken } = useAmbassador();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();
  const queryParams = new URLSearchParams(location.search);
  const token_val = queryParams.get('token');

  const completeSignup = (data) => {
    const captchaValue = captchaRef.current.getValue();
    if (!captchaValue) {
      show('Please verify you are not a robot', 'error');
      return;
    }
    if (!token_val) {
      show('Invalid token', 'error');
      return;
    }
    verifyToken(token_val).then((response) => {
      if (Number(response.status) === 200) {
        const dataToSend = {
          ...data,
          token: token_val,
          captchaValue,
        };
        signupAmbassador(dataToSend).then((res) => {
          if (res) {
            show('Ambassador registered successfully', 'success');
            navigate('/login');
          } else {
            show('Error registering ambassador', 'error');
          }
        });
      } else {
        show('Error validating token', 'error');
        return;
      }
    });
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundColor: '#1f2120',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={Logo}
          alt="Group"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '500px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: '20px',
            [theme.breakpoints.down('sm')]: {
              px: '10px',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
            Complete Your Ambassador Account Activation
          </Typography>
          <Formik
            initialValues={{
              image: '',
              cnic: '',
              gender: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object({
              image: Yup.mixed()
                .required('Image file is required')
                .test(
                  'fileSize',
                  'File size is too large',
                  (value) => value && value.size <= 2000000
                )
                .test(
                  'fileType',
                  'Unsupported file type',
                  (value) =>
                    value &&
                    ['image/png', 'image/jpeg', 'image/jpg'].includes(
                      value.type
                    )
                ),
              cnic: Yup.string()
                .required('Required')
                .matches(/^[0-9]+$/, 'Must be only digits')
                .min(13, 'Must be 13 digits')
                .max(13, 'Must be 13 digits'),
              gender: Yup.string()
                .required('Gender is required')
                .oneOf(['male', 'female', 'other'], 'Invalid gender'),
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
            onSubmit={(values) => {
              const queryParams = new URLSearchParams(location.search);
              const token = queryParams.get('token');
              completeSignup({ values });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <FileInput
                  name="image"
                  placeholderImage={ProfileImg}
                  setFieldValue={setFieldValue}
                />
                <InputField name="cnic" label="CNIC" fullWidth />
                <Dropdown
                  name="gender"
                  label="Gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <InputField
                  name="password"
                  label="Password"
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
                  Activate
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AmbassadorSignup;
