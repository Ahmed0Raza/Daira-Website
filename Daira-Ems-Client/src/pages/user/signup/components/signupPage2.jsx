import React, { useRef } from 'react';
import {
  Button,
  Typography,
  Box,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../../components/inputs/customInput';
import Dropdown from '../../../../components/inputs/dropDownField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserAuth } from '../../auth/userAuth';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';

const SignupComponent = ({ nextStep, prevStep, setFormData, formData }) => {
  const { signup } = useUserAuth();
  const theme = useTheme();
  const captchaRef = useRef(null);
  const { show } = useSnackbar();

  const handleSubmit = async (values, { setSubmitting }) => {
    const captchaValue = captchaRef.current.getValue();
    if (!captchaValue) {
      show('Please verify you are not a robot', 'error');
      setSubmitting(false);
      return;
    }

    const data = { ...formData, ...values, recaptcha: captchaValue };
    const { file, confirmPassword, ...dataToSend } = data;

    setSubmitting(true);
    try {
      const result = await signup(dataToSend);
      if (result) {
        nextStep(true); // Trigger loader before ConfirmationNode
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
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
        <Button
          variant="outlined"
          color="primary"
          onClick={prevStep}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

        <Typography variant="h4" sx={{ fontWeight: '600' }} gutterBottom>
          Welcome to Daira 2025
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please enter your details.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600' }} gutterBottom>
          Sign Up to your account
        </Typography>

        <Formik
          initialValues={{
            contact: '',
            cnic: '',
            gender: '',
            a_id: '',
            city: '',
          }}
          validationSchema={Yup.object({
            contact: Yup.string()
              .required('Required')
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(11, 'Must be 11 digits')
              .max(11, 'Must be 11 digits'),
            cnic: Yup.string()
              .required('Required')
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(13, 'Must be 13 digits')
              .max(13, 'Must be 13 digits'),
            gender: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ marginBottom: '20px' }}>
                <InputField
                  name="contact"
                  label="Contact"
                  type="text"
                  placeholder="Contact"
                />
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <InputField
                  name="cnic"
                  label="CNIC"
                  type="text"
                  placeholder="CNIC"
                />
              </Box>

              <Dropdown
                name="gender"
                label="Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              <Box sx={{ marginBottom: '20px' }}>
                <InputField
                  name="city"
                  label="City"
                  type="text"
                  placeholder="City"
                />
              </Box>

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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Register'
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignupComponent;
