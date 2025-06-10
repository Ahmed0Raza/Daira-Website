import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useField } from 'formik';

const DropdownField = ({ name, label, options, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormControl
      fullWidth
      sx={{ mb: 2, borderRadius: '8px' }}
      error={!!errorText}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        {...props}
        label={label}
        error={!!errorText}
        onChange={(e) => field.onChange(e)}
        onBlur={(e) => field.onBlur(e)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
    </FormControl>
  );
};

export default DropdownField;
