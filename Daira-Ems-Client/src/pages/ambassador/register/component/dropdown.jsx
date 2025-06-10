import React from 'react';
import { MenuItem, TextField } from '@mui/material';

const DropdownTextField = ({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <TextField
      select
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => {
          if (!selected) {
            return <em>{placeholder}</em>;
          }

          const selectedOption = options.find(option => option.value === selected);
          return selectedOption ? selectedOption.label : selected;
        }
      }}
      {...props}
    >
      <MenuItem disabled value="">
        <em>{placeholder}</em>
      </MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropdownTextField;
