import { Grid } from '@mui/material';
import Logo from '../images/Daira 2025 (Dark).png';
import ForgotPasswordCompo from '../components/ForgotPasswordComponent';

const ForgotPassword = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#1f2120',
          height: { xs: '30%', md: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={Logo}
          alt="Group"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ForgotPasswordCompo />
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
