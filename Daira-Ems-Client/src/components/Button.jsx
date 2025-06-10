import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate

const CustomButton = styled(Button)({
  backgroundColor: 'black',
  color: '#fc8b00',
  '&:hover': {
    backgroundColor: '#fc8b00',
    color: 'black',
  },
  border: '1px solid #fc8b00',
  borderRadius: '4px',
  padding: '8px 16px',
  transition: 'background-color 0.3s, color 0.3s',
  marginBottom: '10px',
});

const ButtonCompo = () => {
  const navigate = useNavigate(); // Corrected useNavigate hook usage

  const onClick = () => {
    // Correct definition of an event handler in a functional component
    navigate('/ambassador/dashboard');
  };

  return (
    <CustomButton onClick={onClick} variant="contained">
      Register Now
    </CustomButton>
  );
};

export default ButtonCompo;
