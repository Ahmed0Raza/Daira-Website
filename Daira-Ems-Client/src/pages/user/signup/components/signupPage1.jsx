import React from 'react';
import { Typography, Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// import FileInput from '../../../../components/inputs/fileInput';
import InputField from '../../../../components/inputs/customInput';
// import ProfileImg from '../../../../resources/Daira2024-Logo-White-TransparentBG.png';

const SignupComponent = ({ nextStep, setFormData }) => {
  const theme = useTheme();
  const navigate = useNavigate();

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
          Welcome to Daira 2025
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please enter your details.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
          Sign Up to your account
        </Typography>
        <Formik
          initialValues={{
            // file: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={Yup.object({
            // file: Yup.mixed()
            //   .required('Image file is required')
            //   .test(
            //     'fileSize',
            //     'File size is too large',
            //     (value) => value && value.size <= 2000000
            //   )
            //   .test(
            //     'fileType',
            //     'Unsupported file type',
            //     (value) =>
            //       value &&
            //       ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)
            //   ),
            email: Yup.string()
              .email('Invalid email address')
              .required('Required'),
            password: Yup.string()
              .required('Required')
              .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number and one special character'
              ),
            name: Yup.string()
              .required('Required')
              .matches(/^[a-zA-Z\s]*$/, 'Name must contain only alphabets'),
            confirmPassword: Yup.string()
              .required('Required')
              .oneOf([Yup.ref('password'), null], 'Passwords must match'),
          })}
          onSubmit={(values) => {
            const { /* file, */ ...formData } = values;
            // No need to handle the file conversion here anymore
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //   setFormData({ ...formData, file: reader.result });
            // };
            // reader.readAsDataURL(file);
            setFormData(formData);
            nextStep();
          }}
        >
          {(formik) => (
            <Form>
              {/* <FileInput name="file" placeholderImage={ProfileImg} /> */}
              <Box
                sx={{
                  marginBottom: '20px',
                }}
              >
                <InputField name="name" label="Name" fullWidth />
              </Box>
              <Box
                sx={{
                  marginBottom: '20px',
                }}
              >
                <InputField name="email" label="Email" fullWidth />
              </Box>
              <Box
                sx={{
                  marginBottom: '20px',
                }}
              >
                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                />
              </Box>

              <InputField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 2, height: '50px', borderRadius: '12px' }}
              >
                Next
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignupComponent;
