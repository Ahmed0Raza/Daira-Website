import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PlaceHolder = ({ text }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: '#fc8b00',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default PlaceHolder;
