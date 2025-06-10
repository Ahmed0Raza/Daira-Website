import { Box, Grid, Typography, Link } from '@mui/material';
import footerImage from '../images/daira_logo.jpg';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsApp from '@mui/icons-material/WhatsApp';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: 'background.paper', marginTop: 'auto', padding: 4 }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          lg={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={footerImage}
            alt="Footer Image"
            sx={{
              objectFit: 'contain',
              objectPosition: 'center',
              height: { xs: '128px', sm: '100%', md: '100%', lg: '100%' },
              width: { xs: '50%', sm: '100%', md: '100%', lg: '50%' },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={8} md={8} lg={8} sx={{ p: 4 }}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: 'uppercase', color: '#301C5F' }}
              >
                Call us
              </Typography>
              <Link
                href="#"
                variant="h5"
                sx={{
                  color: '#301C5F',
                  textDecoration: 'underline',
                  textDecorationColor: '#301C5F',
                  '&:hover': { opacity: 0.75 },
                }}
              >
                (041) - 111 128 128
              </Link>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Link
                  href="https://www.facebook.com/fast.daira"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: '#301C5F',
                    textDecoration: 'underline',
                    textDecorationColor: '#301C5F',
                    '&:hover': { opacity: 0.75 },
                  }}
                >
                  <FacebookIcon size={24} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/fast.daira/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: '#301C5F',
                    textDecoration: 'underline',
                    textDecorationColor: '#301C5F',
                    '&:hover': { opacity: 0.75 },
                  }}
                >
                  <InstagramIcon size={24} />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://wa.link/gusjoy"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: '#301C5F',
                    textDecoration: 'underline',
                    textDecorationColor: '#301C5F',
                    '&:hover': { opacity: 0.75 },
                  }}
                >
                  <WhatsApp size={24} />
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ color: '#301C5F' }}>
                    Home
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Link
                      href="/rule-book"
                      sx={{
                        display: 'block',
                        color: '#301C5F',
                        textDecoration: 'underline',
                        textDecorationColor: '#301C5F',
                        '&:hover': { opacity: 0.75 },
                      }}
                    >
                      GuideBook
                    </Link>
                    {/* <Link
                      href="/signup"
                      sx={{
                        display: 'block',
                        color: '#301C5F',
                        textDecoration: 'underline',
                        textDecorationColor: '#301C5F',
                        '&:hover': { opacity: 0.75 },
                      }}
                    >
                      Register
                    </Link>
                    <Link
                      href="/login"
                      sx={{
                        display: 'block',
                        color: '#301C5F',
                        textDecoration: 'underline',
                        textDecorationColor: '#301C5F',
                        '&:hover': { opacity: 0.75 },
                      }}
                    >
                      Login
                    </Link> */}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ color: '#301C5F' }}>
                    About US
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Link
                      href="/meet-the-team"
                      sx={{
                        display: 'block',
                        color: '#301C5F',
                        textDecoration: 'underline',
                        textDecorationColor: '#301C5F',
                        '&:hover': { opacity: 0.75 },
                      }}
                    >
                      Meet the Team
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link
                    href="#"
                    sx={{
                      color: '#301C5F',
                      textDecoration: 'underline',
                      textDecorationColor: '#301C5F',
                      '&:hover': { opacity: 0.75 },
                    }}
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      color: '#301C5F',
                      textDecoration: 'underline',
                      textDecorationColor: '#301C5F',
                      '&:hover': { opacity: 0.75 },
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      color: '#301C5F',
                      textDecoration: 'underline',
                      textDecorationColor: '#301C5F',
                      '&:hover': { opacity: 0.75 },
                    }}
                  >
                    Cookies
                  </Link>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ color: '#301C5F' }}>
                  &copy; 2025. Daira. All rights reserved.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
