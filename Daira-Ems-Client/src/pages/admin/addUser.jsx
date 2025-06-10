import React from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from '../../utils/snackbarContextProvider';
import { useRegistrationAgent } from '../../service/registrationAgentService';
const addUser = () => {
  const { show } = useSnackbar();
  const { createUser } = useRegistrationAgent();
  // State to hold form data
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    cnic: '',
    gender: '',
  });

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.values(formData).some((value) => value === '')) {
      show('Please fill out all fields', 'error');
      return;
    }
    const tokenData = JSON.parse(localStorage.getItem('adminData'));
    const token = tokenData && tokenData.result;
    const res = await createUser(token, formData);
    if (res) show('Registration User Created');
    else show('User Not Created', 'error');
    setFormData({
      name: '',
      email: '',
      password: '',
      contact: '',
      cnic: '',
      gender: '',
    });
  };

  return (
    <div style={{ margin: '20px' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="email"
        />
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="password"
        />
        <TextField
          label="Contact"
          variant="outlined"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CNIC"
          variant="outlined"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            value={formData.gender}
            label="Gender"
            name="gender"
            onChange={handleChange}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create User
        </Button>
      </form>
    </div>
  );
};

export default addUser;
