import { Grid } from '@mui/material';
import Sponser from './Sponsers';

const SponsershipPage = () => {
  return (
    <Grid
      justifyContent="center"
      spacing={2}
      sx={{
        marginTop: '7rem',
      }}
    >
      <Grid item xs={12} md={10} lg={8}>
        <Sponser />
      </Grid>
    </Grid>
  );
};

export default SponsershipPage;
