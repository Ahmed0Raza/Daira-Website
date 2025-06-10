import { Box, Typography } from '@mui/material';

const UnderConstruction = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Page Under Construction
      </Typography>
      <Typography variant="subtitle1">
        We are working hard to bring you a great experience❤️ Please check back
        soon!
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            fontSize: '20px',
          }}
        >
          You can Contact Us:
        </Typography>
        <Typography variant="subtitle1">(041) - 111 128 128</Typography>
        <Typography variant="subtitle1">daira@nu.edu.pk</Typography>
      </Box>
    </Box>
  );
};

export default UnderConstruction;
