import { useEffect, useState } from 'react';
import { Grid, Typography, Box, styled, useTheme } from '@mui/material';
import resets from '../components/_resets.module.css';
import EventButton from '../components/EventButton/EventButton';
import classes from '../components/EventCard.module.css';
import eve0 from '../images/eve0.svg';
import eve1 from '../images/eve1.svg';
import eve2 from '../images/eve2.svg';
import eve3 from '../images/eve3.svg';
import eve4 from '../images/eve4.svg';
import eve5 from '../images/eve5.svg';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const HeroSection = styled('div')({
    background: 'linear-gradient(135deg, #fc8b00 0%, #ff5e00 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
    },
  });

  const CategoryTag = styled('div')(({ category }) => ({
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: getCategoryColor(category),
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 2,
  }));

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Business':
        return '#4a6bff';
      case 'Creative':
        return '#ff6b6b';
      case 'E-sports':
        return '#9c27b0';
      case 'Literature':
        return '#00b894';
      case 'Sports':
        return '#0984e3';
      case 'Technical':
        return '#f39c12';
      default:
        return '#333';
    }
  };

  let filteredEvents;
  useEffect(() => {
    const updateEvents = () => {
      filteredEvents = JSON.parse(localStorage.getItem('filteredEvents')) || [];
      filteredEvents = filteredEvents.filter(
        (event) => event.eventName !== 'Social'
      );
      setEvents(filteredEvents);
    };

    updateEvents();

    const storageListener = () => {
      updateEvents();
    };

    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, [events]);

  const handleCardClick = (event) => {
    if (!event.target.classList.contains(classes.button)) {
      const card = event.target.closest(`.${classes.root}`);
      const id = card.getAttribute('data-event-id');
      navigate(`/event-details/${id}`);
    } else {
      const userData = localStorage.getItem('userData');
      if (userData) {
        navigate('/ambassador/manageParticipants');
      } else {
        navigate('/login');
      }
    }
  };

  const getCategoryImage = (category) => {
    switch (category) {
      case 'Business':
        return eve2;
      case 'Creative':
        return eve4;
      case 'E-sports':
        return eve0;
      case 'Literature':
        return eve5;
      case 'Sports':
        return eve3;
      case 'Technical':
        return eve1;
      default:
        return null;
    }
  };

  return (
    <div>
      <HeroSection>
        <Typography
          variant="h2"
          sx={{
            fontWeight: '800',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginTop: '50px',
          }}
        >
          Explore Our Events
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.9,
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          Discover exciting competitions, workshops, and activities across
          various categories
        </Typography>
      </HeroSection>

      <Box
        sx={{
          padding: { xs: '20px', md: '40px' },
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <div id={`section${index}`}>
                <div
                  onClick={handleCardClick}
                  className={`${resets.clapyResets} ${classes.root}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getCategoryImage(event.eventCategory)})`,
                    cursor: 'pointer',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    height: '350px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                  data-event-id={event._id}
                >
                  <CategoryTag category={event.eventCategory}>
                    {event.eventCategory}
                  </CategoryTag>

                  <div className={classes.rectangle15}></div>
                  <div className={classes.rectangle19}></div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      right: '20px',
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: '700',
                        mb: 1,
                        fontSize: '1.5rem',
                      }}
                    >
                      {event.eventName}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div className={classes.prizeMoney2000Rs}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                          Prize Money
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                          {event.prizeMoney}
                        </Typography>
                      </div>

                      <EventButton
                        className={classes.button2}
                        text={{
                          button: (
                            <div
                              className={classes.button}
                              style={{
                                background: getCategoryColor(
                                  event.eventCategory
                                ),
                                '&:hover': {
                                  background: `${getCategoryColor(event.eventCategory)}`,
                                  opacity: 0.9,
                                },
                              }}
                            >
                              Register
                            </div>
                          ),
                        }}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default EventsPage;
