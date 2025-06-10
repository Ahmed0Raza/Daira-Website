import { Box, Container, Grid } from '@mui/material';
import footerImage from '../images/footer.png';
import Quote from './Quote';
import MeetTheTeam from '../pages/MeetTheTeam';

const About = () => {
  return (
    <Box>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: '10px', md: '20px' },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              component="img"
              src={footerImage}
              alt="Footer Image"
              sx={{
                objectFit: 'contain',
                objectPosition: 'center',
                height: { xs: '128px', sm: '200px', md: '300px', lg: '400px' },
                width: '100%',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Quote />
          </Grid>
        </Grid>
      </Container>
      {/* <MeetTheTeam /> */}
    </Box>
  );
};

export default About;
