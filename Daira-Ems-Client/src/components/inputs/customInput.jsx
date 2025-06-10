import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const InputField = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <TextField
      {...field}
      {...props}
      error={!!errorText}
      helperText={errorText}
      fullWidth
      sx={{ borderRadius: '8px' }}
    />
  );
};

export default InputField;
