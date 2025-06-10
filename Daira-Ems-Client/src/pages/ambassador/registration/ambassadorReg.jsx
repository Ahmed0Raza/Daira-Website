import { useState, useRef, useEffect } from 'react';
import {
  Typography,
  Divider,
  styled,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Container,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAmbassador } from '../../../service/ambassadorService';

const CenteredHeading = styled('div')({
  textAlign: 'center',
  marginBottom: '2rem',
});

const ThickerDivider = styled(Divider)({
  backgroundColor: '#5D08B3',
  width: '60px',
  margin: 'auto',
  height: '3px',
});

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  backgroundColor: '#5D08B3',
  color: 'white',
  width: '100%',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#4a0690',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(93, 8, 179, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#9b75b7',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#5D08B3',
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5D08B3',
    },
    '&:hover fieldset': {
      borderColor: '#5D08B3',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#5D08B3',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5D08B3',
    },
    '&:hover fieldset': {
      borderColor: '#5D08B3',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#5D08B3',
    },
  },
}));

const AmbassadorReg = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const captchaRef = useRef(null);
  const { createAmbassador } = useAmbassador();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const [formData, setFormData] = useState({
    name: '',
    instituteName: '',
    campusName: '',
    department: '',
    rollnumber: '',
    city: '',
    phoneNumber: '',
    email: '',
    studentAffair: '',
    studentAffairPhoneNumber: '',
    prevExperince: '',
    plans: '',
    participantsNumber: '',
    instituteType: 'University',
    batch: 'Batch2021',
    attendedDairaBefore: 'yes',
    workedAsAmbassadorBefore: 'yes',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^03\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let processedValue = value;

    setTouched({
      ...touched,
      [name]: true,
    });

    // Sanitize and validate inputs
    switch (name) {
      case 'phoneNumber':
      case 'studentAffairPhoneNumber':
        processedValue = value.replace(/\D/g, '');
        if (!processedValue.startsWith('03') && processedValue.length >= 2) {
          processedValue = '03' + processedValue.slice(2);
        }
        processedValue = processedValue.slice(0, 11);
        break;
      case 'participantsNumber':
        processedValue = value.replace(/\D/g, '');
        processedValue = processedValue.slice(0, 4);
        const num = parseInt(processedValue);
        if (num > 1000) processedValue = '1000';
        break;
      case 'name':
      case 'studentAffair':
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'email':
        processedValue = value.toLowerCase();
        break;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    validateField(name, processedValue);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let fieldError = '';

    if (value.trim() === '') {
      fieldError = 'This field is required';
    } else if (name === 'email' && !validateEmail(value)) {
      fieldError = 'Please enter a valid email address';
    } else if (name === 'phoneNumber' && !validatePhoneNumber(value)) {
      fieldError = 'Please enter a valid phone number of 11 digits.';
    } else if (
      name === 'studentAffairPhoneNumber' &&
      !validatePhoneNumber(value)
    ) {
      fieldError = 'Please enter a valid phone number of 11 digits.';
    } else if (
      name === 'participantsNumber' &&
      (parseInt(value) <= 0 || isNaN(parseInt(value)))
    ) {
      fieldError = 'Please enter a valid number of participants';
    }

    setErrors({
      ...errors,
      [name]: fieldError,
    });

    return !fieldError;
  };

  const validateForm = () => {
    const formFields = Object.keys(formData);
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    formFields.forEach((field) => {
      newTouched[field] = true;
      const value = formData[field].toString().trim();

      if (value === '') {
        newErrors[field] = 'This field is required';
        isValid = false;
      }

      switch (field) {
        case 'email':
          if (!validateEmail(value)) {
            newErrors[field] = 'Please enter a valid email address';
            isValid = false;
          }
          break;
        case 'phoneNumber':
        case 'studentAffairPhoneNumber':
          if (!validatePhoneNumber(value)) {
            newErrors[field] =
              'Please enter a valid phone number starting with 03';
            isValid = false;
          }
          break;
        case 'participantsNumber':
          const num = parseInt(value);
          if (isNaN(num) || num <= 0 || num > 1000) {
            newErrors[field] = 'Please enter a number between 1 and 1000';
            isValid = false;
          }
          break;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setOpen(false); // Close any existing snackbar

      if (!validateForm()) {
        show('Please fill all required fields correctly', 'error');
        return;
      }

      const captchaValue = captchaRef.current?.getValue();
      if (!captchaValue) {
        show('Please verify you are not a robot', 'error');
        return;
      }

      const response = {
        name: formData.name,
        institute: formData.instituteName,
        campusName: formData.campusName,
        typeOfInstitute: formData.instituteType,
        department: formData.department,
        rollNumber: formData.rollnumber,
        city: formData.city,
        batch: formData.batch,
        phoneNumber: parseInt(formData.phoneNumber),
        email: formData.email,
        studentAffairOfficerName: formData.studentAffair,
        studentAffairOfficerContact: parseInt(
          formData.studentAffairPhoneNumber
        ),
        attendedDairaBefore: formData.attendedDairaBefore === 'yes',
        ambassadorDaira: formData.workedAsAmbassadorBefore === 'yes',
        previousExperience: formData.prevExperince,
        plansOfDaira: formData.plans,
        participantsNumber: parseInt(formData.participantsNumber),
        captchaValue: captchaValue,
      };

      const res = await createAmbassador(response);

      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        show(
          'Registration successful! Please check your email for further instructions.',
          'success'
        );
        // Reset form
        setFormData({
          name: '',
          instituteName: '',
          campusName: '',
          department: '',
          rollnumber: '',
          city: '',
          phoneNumber: '',
          email: '',
          studentAffair: '',
          studentAffairPhoneNumber: '',
          prevExperince: '',
          plans: '',
          participantsNumber: '',
          instituteType: 'University',
          batch: 'Batch2021',
          attendedDairaBefore: 'yes',
          workedAsAmbassadorBefore: 'yes',
        });
        setTouched({});
        setErrors({});
        setSuccessSubmit(true);
        captchaRef.current?.reset();
      } else {
        const errorMessage =
          res?.data?.message ||
          res?.response?.data?.message ||
          'Registration failed. Please try again.';
        show(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      show(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const show = (msg, type) => {
    setOpen(false); // First close any existing snackbar
    setTimeout(() => {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    }, 100);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(touched).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [touched]);

  // Add this new function to check for active errors
  const hasActiveErrors = () => {
    // Only check errors for touched fields
    return Object.keys(touched).some((field) => !!errors[field]);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <CenteredHeading>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: '#5D08B3',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              textTransform: 'uppercase',
              marginTop: '40px',
            }}
          >
            Ambassador Applications
          </Typography>
          <ThickerDivider />
        </CenteredHeading>

        <FormPaper elevation={3}>
          <StyledForm onSubmit={handleSubmit} noValidate>
            {/* Personal Information Section */}
            <FormSection>
              <SectionTitle variant="h6">Personal Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    required
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={touched.phoneNumber && !!errors.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    required
                    inputProps={{ inputMode: 'numeric' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    error={touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    required
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Educational Information Section */}
            <FormSection>
              <SectionTitle variant="h6">Educational Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="instituteName"
                    label="Institute Name"
                    variant="outlined"
                    fullWidth
                    value={formData.instituteName}
                    onChange={handleChange}
                    error={touched.instituteName && !!errors.instituteName}
                    helperText={touched.instituteName && errors.instituteName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="campusName"
                    label="Campus Name"
                    variant="outlined"
                    fullWidth
                    value={formData.campusName}
                    onChange={handleChange}
                    error={touched.campusName && !!errors.campusName}
                    helperText={touched.campusName && errors.campusName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledFormControl
                    fullWidth
                    error={touched.instituteType && !!errors.instituteType}
                  >
                    <InputLabel id="instituteType-label">
                      Type of Institute *
                    </InputLabel>
                    <Select
                      labelId="instituteType-label"
                      name="instituteType"
                      value={formData.instituteType}
                      onChange={handleSelectChange}
                      label="Type of Institute *"
                    >
                      <MenuItem value="University">University</MenuItem>
                      <MenuItem value="College">College</MenuItem>
                      <MenuItem value="School">School</MenuItem>
                      <MenuItem value="Organization">Organization</MenuItem>
                    </Select>
                    {touched.instituteType && errors.instituteType && (
                      <FormHelperText>{errors.instituteType}</FormHelperText>
                    )}
                  </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="department"
                    label="Department"
                    variant="outlined"
                    fullWidth
                    value={formData.department}
                    onChange={handleChange}
                    error={touched.department && !!errors.department}
                    helperText={touched.department && errors.department}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="rollnumber"
                    label="Roll Number"
                    variant="outlined"
                    fullWidth
                    value={formData.rollnumber}
                    onChange={handleChange}
                    error={touched.rollnumber && !!errors.rollnumber}
                    helperText={touched.rollnumber && errors.rollnumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledFormControl
                    fullWidth
                    error={touched.batch && !!errors.batch}
                  >
                    <InputLabel id="batch-label">Batch *</InputLabel>
                    <Select
                      labelId="batch-label"
                      name="batch"
                      value={formData.batch}
                      onChange={handleSelectChange}
                      label="Batch *"
                    >
                      <MenuItem value="Batch2021">Batch 2021</MenuItem>
                      <MenuItem value="Batch2022">Batch 2022</MenuItem>
                      <MenuItem value="Batch2023">Batch 2023</MenuItem>
                      <MenuItem value="Batch2024">Batch 2024</MenuItem>
                    </Select>
                    {touched.batch && errors.batch && (
                      <FormHelperText>{errors.batch}</FormHelperText>
                    )}
                  </StyledFormControl>
                </Grid>
              </Grid>
            </FormSection>

            {/* Student Affairs Information */}
            <FormSection>
              <SectionTitle variant="h6">
                Student Affairs Information
              </SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="studentAffair"
                    label="Student Affairs Officer Name"
                    variant="outlined"
                    fullWidth
                    value={formData.studentAffair}
                    onChange={handleChange}
                    error={touched.studentAffair && !!errors.studentAffair}
                    helperText={touched.studentAffair && errors.studentAffair}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="studentAffairPhoneNumber"
                    label="Student Affairs Contact Number"
                    variant="outlined"
                    fullWidth
                    value={formData.studentAffairPhoneNumber}
                    onChange={handleChange}
                    error={
                      touched.studentAffairPhoneNumber &&
                      !!errors.studentAffairPhoneNumber
                    }
                    helperText={
                      touched.studentAffairPhoneNumber &&
                      errors.studentAffairPhoneNumber
                    }
                    required
                    inputProps={{ inputMode: 'numeric' }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Daira Experience */}
            <FormSection>
              <SectionTitle variant="h6">Daira Experience</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledFormControl
                    fullWidth
                    error={
                      touched.attendedDairaBefore &&
                      !!errors.attendedDairaBefore
                    }
                  >
                    <InputLabel id="attendedDairaBefore-label">
                      Have you ever attended Daira before? *
                    </InputLabel>
                    <Select
                      labelId="attendedDairaBefore-label"
                      name="attendedDairaBefore"
                      value={formData.attendedDairaBefore}
                      onChange={handleSelectChange}
                      label="Have you ever attended Daira before? *"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                    {touched.attendedDairaBefore &&
                      errors.attendedDairaBefore && (
                        <FormHelperText>
                          {errors.attendedDairaBefore}
                        </FormHelperText>
                      )}
                  </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledFormControl
                    fullWidth
                    error={
                      touched.workedAsAmbassadorBefore &&
                      !!errors.workedAsAmbassadorBefore
                    }
                  >
                    <InputLabel id="workedAsAmbassadorBefore-label">
                      Have you worked as a Daira ambassador before? *
                    </InputLabel>
                    <Select
                      labelId="workedAsAmbassadorBefore-label"
                      name="workedAsAmbassadorBefore"
                      value={formData.workedAsAmbassadorBefore}
                      onChange={handleSelectChange}
                      label="Have you worked as a Daira ambassador before? *"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                    {touched.workedAsAmbassadorBefore &&
                      errors.workedAsAmbassadorBefore && (
                        <FormHelperText>
                          {errors.workedAsAmbassadorBefore}
                        </FormHelperText>
                      )}
                  </StyledFormControl>
                </Grid>
              </Grid>
            </FormSection>

            {/* Previous Experience & Plans */}
            <FormSection>
              <SectionTitle variant="h6">Experience & Plans</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    name="prevExperince"
                    label="Previous event organizing experience"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.prevExperince}
                    onChange={handleChange}
                    error={touched.prevExperince && !!errors.prevExperince}
                    helperText={touched.prevExperince && errors.prevExperince}
                    required
                    placeholder="Please describe your previous experience organizing events..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="plans"
                    label="Plans to market Daira'25 in your campus"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.plans}
                    onChange={handleChange}
                    error={touched.plans && !!errors.plans}
                    helperText={touched.plans && errors.plans}
                    required
                    placeholder="What strategies will you use to promote Daira'24 at your institution?"
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="participantsNumber"
                    label="Estimated number of participants you can bring"
                    variant="outlined"
                    fullWidth
                    value={formData.participantsNumber}
                    onChange={handleChange}
                    error={
                      touched.participantsNumber && !!errors.participantsNumber
                    }
                    helperText={
                      touched.participantsNumber && errors.participantsNumber
                    }
                    required
                    inputProps={{
                      inputMode: 'numeric',
                      style: { width: '100%' },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        width: 'auto',
                        whiteSpace: 'normal',
                        maxWidth: '100%',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* reCAPTCHA and Submit */}
            <FormSection>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    my: 2,
                  }}
                >
                  <ReCAPTCHA
                    sitekey="6LfnTKspAAAAAAkOSvnqFnIcu-nd_ioY_QQ1bpFS"
                    ref={captchaRef}
                    size={isMobile ? 'compact' : 'normal'}
                  />
                </Box>

                <StyledButton
                  type="submit"
                  disabled={isSubmitting || hasActiveErrors()}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Register as Ambassador'}
                </StyledButton>

                <Typography
                  variant="caption"
                  align="center"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  By submitting this form, you agree to our terms and
                  conditions. All fields marked with * are required.
                </Typography>
              </Box>
            </FormSection>
          </StyledForm>
        </FormPaper>
      </Box>
      {/* <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          marginTop: '20px',
          '& .MuiAlert-root': {
            width: '100%',
            minWidth: '300px'
          }
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
          elevation={6}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar> */}
    </Container>
  );
};

export default AmbassadorReg;
