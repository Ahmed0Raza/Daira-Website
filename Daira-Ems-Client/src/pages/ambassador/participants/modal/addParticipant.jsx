import { useState } from 'react';
import { Box, Button, Checkbox, Typography } from '@mui/material';
import InputField from '../../../../components/inputs/customInput';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from '../../../../utils/snackbarContextProvider';
import { useRegistration } from '../../../../service/registerationService';
import DropdownField from '../../../../components/inputs/dropDownField';

const AddParticipant = () => {
  const [formData, setFormData] = useState({});
  const { addParticipant } = useRegistration();
  const { show } = useSnackbar();

  const handleSubmit = async (values, { resetForm }) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const tokenData = userData.data;
    const token = tokenData.token;
    const userid = tokenData.result._id;
    const requestBody2 = { ...values, userid };

    const { contact, ...requestBody3 } = requestBody2;
    const requestBody = {
      ...requestBody3,
      contactNumber: contact,
    };
    try {
      await addParticipant(requestBody, token);
      show('Participant added successfully', 'success');
      resetForm();
    } catch (error) {
      show('Error adding participant', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '16px 10px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        height: '100%',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Add New Participant
      </Typography>

      <Formik
        initialValues={{
          name: '',
          cnic: '',
          contact: '',
          gender: '',
          accomodation: false,
        }}
        validationSchema={Yup.object({
          cnic: Yup.string()
            .required('Required')
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(13, 'Must be 13 digits')
            .max(13, 'Must be 13 digits'),
            name: Yup.string()
            .required('Required')
            .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),        
          gender: Yup.string().required('Required'),
          contact: Yup.string()
            .required('Required')
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(11, 'Must be 11 digits')
            .max(11, 'Must be 11 digits'),
        })}
        onSubmit={(values, { resetForm }) => {
          const { /* file, */ ...formData } = values;
          setFormData(formData);
          handleSubmit(formData, { resetForm });
        }}
      >
        {(formik) => (
          <Form style={{ width: '100%' }}>
            <Typography variant="body1">Name</Typography>
            <InputField name="name" placeholder="Name" fullWidth />
            <Typography
              variant="body2"
              gutterBottom
              sx={{ marginBottom: '15px' }}
            >
              Please enter full name coherent with the CNIC
            </Typography>

            <Typography variant="body1">CNIC</Typography>
            <InputField name="cnic" placeholder="XXXXX-XXXXXXX-X" fullWidth />
            <Typography
              variant="body2"
              gutterBottom
              sx={{ marginBottom: '15px' }}
            >
              Please enter CNIC of participant
            </Typography>

            <Typography variant="body1">Contact Number</Typography>
            <InputField name="contact" placeholder="03211234567" fullWidth />
            <Typography
              variant="body2"
              gutterBottom
              sx={{ marginBottom: '15px' }}
            >
              Please enter contact number of participant
            </Typography>

            <DropdownField
              name="gender"
              label="Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
                width: '100%',
                borderRadius: '2px',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                padding: '10px',
              }}
            >
              <Checkbox
                name="accomodation"
                onChange={(event) => {
                  formik.handleChange({
                    target: {
                      name: 'accomodation',
                      value: event.target.checked,
                    },
                  });
                }}
                checked={formik.values.accomodation}
                color="primary"
                sx={{
                  padding: '0',
                  margin: '4px',
                  '&.MuiCheckbox-root': {
                    color: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSvgIcon-root': {
                    borderRadius: '4px',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
                  '& .MuiSvgIcon-root.Mui-checked': {
                    borderColor: 'primary.main',
                  },
                }}
              />

              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color: 'rgba(0, 0, 0, 0.9)',
                  marginTop: '7px',
                }}
              >
                Need Accomodation
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                height: '50px',
                borderRadius: '12px',
                backgroundColor: '#FFC107',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#E0A800',
                },
              }}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddParticipant;
