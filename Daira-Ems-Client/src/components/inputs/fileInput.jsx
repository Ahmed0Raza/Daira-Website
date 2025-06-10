import React, { useRef } from 'react';
import { useField } from 'formik';
import { Box, Typography } from '@mui/material';
import CameraSvg from '../assets/camera.svg';

const FileInput = ({ name, placeholderImage, setFieldValue }) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      helpers.setValue(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue(name + 'Preview', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      mb={2}
      onClick={handleDivClick}
    >
      <Box
        sx={{
          width: '175px',
          height: '175px',
          borderRadius: '43px',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: 'black',
          overflow: 'hidden',
          border: '1px solid #ced4da',
        }}
      >
        <img
          src={meta.value ? URL.createObjectURL(meta.value) : placeholderImage}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            borderRadius: '43px',
          }}
          alt="Profile"
        />
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#000000B2',
            top: 0,
            width: '100%',
            height: '100%',
            borderRadius: '43px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={CameraSvg} alt="camera" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleChange}
          accept="image/png, image/jpeg, image/jpg"
        />
      </Box>
      {meta.touched && meta.error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {meta.error}
        </Typography>
      )}
    </Box>
  );
};

export default FileInput;
