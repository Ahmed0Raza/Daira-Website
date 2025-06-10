import { useState, useEffect, useRef } from 'react';
import { Typography, useTheme, Box, Container } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import richMond from '../images/rich_mond.png';
import brainyteLogo from '../images/BrainyteLogo.jpg';
import mgc from '../images/mgc.jpg';
import cafeElegance from '../images/cafeElegance.png';
import timeconsultant from '../images/timeConsultantt.png';
import orkans from '../images/Orkans.png';
import studyicon from '../images/studyicon.png';
import faana from '../images/faana.jpg';
import LaBistro from '../images/LaBistro.png';

const SponsorsMarquee = () => {
  const theme = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const titleControls = useAnimation();
  const titleSponsorControls = useAnimation();
  const platinumControls = useAnimation();
  const silverControls = useAnimation();
  const foodPartnerControls = useAnimation();
  const hydrationPartnerControls = useAnimation();

  // Track pause state for all marquees
  const [isTitleSponsorPaused, setIsTitleSponsorPaused] = useState(false);
  const [isPlatinumPaused, setIsPlatinumPaused] = useState(false);
  const [isSilverPaused, setIsSilverPaused] = useState(false);
  const [isFoodPartnerPaused, setIsFoodPartnerPaused] = useState(false);
  const [isHydrationPartnerPaused, setIsHydrationPartnerPaused] =
    useState(false);

  // Refs for timeouts
  const titleSponsorTimeoutRef = useRef(null);
  const platinumTimeoutRef = useRef(null);
  const silverTimeoutRef = useRef(null);
  const foodPartnerTimeoutRef = useRef(null);
  const hydrationPartnerTimeoutRef = useRef(null);

  // Create arrays with sufficient repetition to ensure no visible restarts in the animation
  const titleSponsors = Array(24).fill(brainyteLogo);
  const platinumSponsors = Array(12)
    .fill(null)
    .flatMap(() => [mgc, cafeElegance]);
  const silverSponsors = Array(12)
    .fill(null)
    .flatMap(() => [richMond, timeconsultant, orkans, studyicon, faana]);
  const foodPartners = Array(24).fill(LaBistro);
  const hydrationPartners = Array(24).fill(cafeElegance);

  // Base marquee animation configuration - adjusted for better looping
  const getMarqueeConfig = (itemsCount, duration = 50) => ({
    x: [0, `-${itemsCount * 100}px`], // Dynamic translation based on number of items
    transition: {
      x: {
        repeat: Infinity,
        duration: duration,
        ease: 'linear',
        repeatType: 'loop',
      },
    },
  });

  // Initialize animations when component mounts or when inView changes
  useEffect(() => {
    if (inView) {
      titleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      });

      // Start initial animations if not paused
      if (!isTitleSponsorPaused) {
        titleSponsorControls.start(getMarqueeConfig(titleSponsors.length));
      }

      if (!isPlatinumPaused) {
        platinumControls.start(getMarqueeConfig(platinumSponsors.length));
      }

      if (!isSilverPaused) {
        silverControls.start(getMarqueeConfig(silverSponsors.length));
      }

      if (!isFoodPartnerPaused) {
        foodPartnerControls.start(getMarqueeConfig(foodPartners.length));
      }

      if (!isHydrationPartnerPaused) {
        hydrationPartnerControls.start(
          getMarqueeConfig(hydrationPartners.length)
        );
      }
    }

    // Cleanup timeouts on unmount
    return () => {
      if (titleSponsorTimeoutRef.current)
        clearTimeout(titleSponsorTimeoutRef.current);
      if (platinumTimeoutRef.current) clearTimeout(platinumTimeoutRef.current);
      if (silverTimeoutRef.current) clearTimeout(silverTimeoutRef.current);
      if (foodPartnerTimeoutRef.current)
        clearTimeout(foodPartnerTimeoutRef.current);
      if (hydrationPartnerTimeoutRef.current)
        clearTimeout(hydrationPartnerTimeoutRef.current);
    };
  }, [
    inView,
    titleControls,
    titleSponsors.length,
    platinumSponsors.length,
    silverSponsors.length,
    foodPartners.length,
    hydrationPartners.length,
  ]);

  // Effects to handle changes in pause states
  useEffect(() => {
    if (!isTitleSponsorPaused) {
      titleSponsorControls.start(getMarqueeConfig(titleSponsors.length));
    } else {
      titleSponsorControls.stop();
    }
  }, [isTitleSponsorPaused, titleSponsorControls, titleSponsors.length]);

  useEffect(() => {
    if (!isPlatinumPaused) {
      platinumControls.start(getMarqueeConfig(platinumSponsors.length));
    } else {
      platinumControls.stop();
    }
  }, [isPlatinumPaused, platinumControls, platinumSponsors.length]);

  useEffect(() => {
    if (!isSilverPaused) {
      silverControls.start(getMarqueeConfig(silverSponsors.length));
    } else {
      silverControls.stop();
    }
  }, [isSilverPaused, silverControls, silverSponsors.length]);

  useEffect(() => {
    if (!isFoodPartnerPaused) {
      foodPartnerControls.start(getMarqueeConfig(foodPartners.length));
    } else {
      foodPartnerControls.stop();
    }
  }, [isFoodPartnerPaused, foodPartnerControls, foodPartners.length]);

  useEffect(() => {
    if (!isHydrationPartnerPaused) {
      hydrationPartnerControls.start(
        getMarqueeConfig(hydrationPartners.length)
      );
    } else {
      hydrationPartnerControls.stop();
    }
  }, [
    isHydrationPartnerPaused,
    hydrationPartnerControls,
    hydrationPartners.length,
  ]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  // Handle pause/resume for each marquee
  const handleTitleSponsorClick = () => {
    setIsTitleSponsorPaused(true);

    if (titleSponsorTimeoutRef.current) {
      clearTimeout(titleSponsorTimeoutRef.current);
    }

    titleSponsorTimeoutRef.current = setTimeout(() => {
      setIsTitleSponsorPaused(false);
    }, 3000);
  };

  const handlePlatinumClick = () => {
    setIsPlatinumPaused(true);

    if (platinumTimeoutRef.current) {
      clearTimeout(platinumTimeoutRef.current);
    }

    platinumTimeoutRef.current = setTimeout(() => {
      setIsPlatinumPaused(false);
    }, 3000);
  };

  const handleSilverClick = () => {
    setIsSilverPaused(true);

    if (silverTimeoutRef.current) {
      clearTimeout(silverTimeoutRef.current);
    }

    silverTimeoutRef.current = setTimeout(() => {
      setIsSilverPaused(false);
    }, 3000);
  };

  const handleFoodPartnerClick = () => {
    setIsFoodPartnerPaused(true);

    if (foodPartnerTimeoutRef.current) {
      clearTimeout(foodPartnerTimeoutRef.current);
    }

    foodPartnerTimeoutRef.current = setTimeout(() => {
      setIsFoodPartnerPaused(false);
    }, 3000);
  };

  const handleHydrationPartnerClick = () => {
    setIsHydrationPartnerPaused(true);

    if (hydrationPartnerTimeoutRef.current) {
      clearTimeout(hydrationPartnerTimeoutRef.current);
    }

    hydrationPartnerTimeoutRef.current = setTimeout(() => {
      setIsHydrationPartnerPaused(false);
    }, 3000);
  };

  // Function to determine if logo is timeConsultant to apply special styling
  const isTimeConsultant = (logo) => logo === timeconsultant;

  // Function to determine if logo is cafeElegance to apply special sizing
  const isCafeElegance = (logo) => logo === cafeElegance;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 10 } }}>
      <Box
        component={motion.div}
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={titleControls}
        sx={{
          textAlign: 'center',
          mb: { xs: 3, md: 8 },
          position: 'relative',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#301C5F',
            fontWeight: 800,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3.5rem' },
            textTransform: 'uppercase',
            letterSpacing: { xs: '1px', md: '2px' },
            position: 'relative',
            display: 'inline-block',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: { xs: '-12px', md: '-20px' },
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: '40px', md: '60px' },
              height: { xs: '4px', md: '6px' },
              background: '#F3E52F',
              borderRadius: '3px',
            },
          }}
        >
          Our Sponsors
        </Typography>
      </Box>

      <Box
        component={motion.div}
        variants={fadeIn}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          py: { xs: 2, md: 3 },
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: { xs: '80px', md: '150px' },
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, #fff, rgba(255,255,255,0))',
          },
        }}
      >
        {/* Title Sponsors Section - Updated with improved colors */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            pt: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background:
                'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: { xs: '1px', md: '2px' },
              position: 'relative',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-6px', md: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '30px', md: '40px' },
                height: { xs: '2px', md: '3px' },
                background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF8C00)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
              },
            }}
          >
            Title Sponsor
          </Typography>
          <Box
            component={motion.div}
            animate={titleSponsorControls}
            onClick={handleTitleSponsorClick}
            sx={{
              display: 'flex',
              width: 'max-content',
              cursor: 'pointer',
              touchAction: 'pan-x',
              opacity: isTitleSponsorPaused ? 0.8 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {titleSponsors.map((logo, index) => (
              <Box
                key={`title-${index}`}
                component={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
                sx={{
                  mx: { xs: 1, sm: 2, md: 3 },
                  my: { xs: 1, md: 2 },
                  p: { xs: 1, md: 2 },
                  height: { xs: '80px', sm: '110px', md: '160px' },
                  width: { xs: '120px', sm: '170px', md: '260px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: { xs: '10px', md: '16px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #FFD700',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.15)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '10%',
                  }}
                >
                  <img
                    src={logo}
                    alt={`Title Sponsor ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(0)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Hydration Partner Section - Added faana logo */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            pt: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background:
                'linear-gradient(135deg, #00C9FF 0%, #4DD0E1 50%, #92FE9D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: { xs: '1px', md: '2px' },
              position: 'relative',
              textShadow: '0 0 10px rgba(0, 201, 255, 0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-6px', md: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '30px', md: '40px' },
                height: { xs: '2px', md: '3px' },
                background: 'linear-gradient(90deg, #00C9FF, #4DD0E1, #92FE9D)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(0, 201, 255, 0.5)',
              },
            }}
          >
            Hydration Partner
          </Typography>
          <Box
            component={motion.div}
            animate={hydrationPartnerControls}
            onClick={handleHydrationPartnerClick}
            sx={{
              display: 'flex',
              width: 'max-content',
              cursor: 'pointer',
              touchAction: 'pan-x',
              opacity: isHydrationPartnerPaused ? 0.8 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {hydrationPartners.map((logo, index) => (
              <Box
                key={`hydration-${index}`}
                component={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
                sx={{
                  mx: { xs: 1, sm: 2, md: 3 },
                  my: { xs: 1, md: 2 },
                  p: { xs: 1, md: 2 },
                  height: { xs: '80px', sm: '110px', md: '160px' },
                  width: { xs: '120px', sm: '170px', md: '260px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: { xs: '10px', md: '16px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #00C9FF',
                  boxShadow: '0 4px 12px rgba(0, 201, 255, 0.15)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '10%',
                  }}
                >
                  <img
                    src={logo}
                    alt={`Hydration Partner ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(0)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Platinum Sponsors Section - Make MGC card sizing consistent with others */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            pt: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background:
                'linear-gradient(135deg, #E5E4E2 0%, #8F8F8F 50%, #C0C0C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: { xs: '1px', md: '2px' },
              position: 'relative',
              textShadow: '0 0 10px rgba(229, 228, 226, 0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-6px', md: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '30px', md: '40px' },
                height: { xs: '2px', md: '3px' },
                background: 'linear-gradient(90deg, #E5E4E2, #8F8F8F, #C0C0C0)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(229, 228, 226, 0.5)',
              },
            }}
          >
            Platinum Sponsors
          </Typography>
          <Box
            component={motion.div}
            animate={platinumControls}
            onClick={handlePlatinumClick}
            sx={{
              display: 'flex',
              width: 'max-content',
              cursor: 'pointer',
              touchAction: 'pan-x',
              opacity: isPlatinumPaused ? 0.8 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {platinumSponsors.map((logo, index) => (
              <Box
                key={`platinum-${index}`}
                component={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
                sx={{
                  mx: { xs: 1, sm: 2, md: 3 },
                  my: { xs: 1, md: 2 },
                  p: { xs: 1, md: 2 },
                  height: { xs: '80px', sm: '110px', md: '160px' },
                  width: { xs: '120px', sm: '170px', md: '260px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: { xs: '10px', md: '16px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #C0C0C0',
                  boxShadow: '0 4px 12px rgba(192, 192, 192, 0.15)',
                  ...(isCafeElegance(logo) && {
                    height: { xs: '80px', sm: '110px', md: '160px' },
                    width: { xs: '120px', sm: '170px', md: '260px' },
                  }),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '10%',
                  }}
                >
                  <img
                    src={logo}
                    alt={`Platinum Sponsor ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(0)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Silver Sponsors Section - Added Orkans logo */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            pt: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background:
                'linear-gradient(135deg, #708090 0%, #A9A9A9 50%, #778899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: { xs: '1px', md: '2px' },
              position: 'relative',
              textShadow: '0 0 10px rgba(112, 128, 144, 0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-6px', md: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '30px', md: '40px' },
                height: { xs: '2px', md: '3px' },
                background: 'linear-gradient(90deg, #708090, #A9A9A9, #778899)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(112, 128, 144, 0.5)',
              },
            }}
          >
            Silver Sponsors
          </Typography>
          <Box
            component={motion.div}
            animate={silverControls}
            onClick={handleSilverClick}
            sx={{
              display: 'flex',
              width: 'max-content',
              cursor: 'pointer',
              touchAction: 'pan-x',
              opacity: isSilverPaused ? 0.8 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {silverSponsors.map((logo, index) => (
              <Box
                key={`silver-${index}`}
                component={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
                sx={{
                  mx: { xs: 1, sm: 2, md: 3 },
                  my: { xs: 1, md: 2 },
                  p: { xs: 1, md: 2 },
                  height: { xs: '80px', sm: '110px', md: '160px' },
                  width: { xs: '120px', sm: '170px', md: '260px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: { xs: '10px', md: '16px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #708090',
                  boxShadow: '0 4px 12px rgba(112, 128, 144, 0.15)',
                  ...(isTimeConsultant(logo) && {
                    border: '1px solid #708090',
                    boxShadow: '0 6px 18px rgba(112, 128, 144, 0.25)',
                  }),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '10%',
                  }}
                >
                  <img
                    src={logo}
                    alt={`Silver Sponsor ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(0)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Food Partner Section - Added LaBistro logo */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            pt: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background:
                'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFB88C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: { xs: '1px', md: '2px' },
              position: 'relative',
              textShadow: '0 0 10px rgba(255, 107, 107, 0.3)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: '-6px', md: '-10px' },
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '30px', md: '40px' },
                height: { xs: '2px', md: '3px' },
                background: 'linear-gradient(90deg, #FF6B6B, #FF8E53, #FFB88C)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(255, 107, 107, 0.5)',
              },
            }}
          >
            Food Partner
          </Typography>
          <Box
            component={motion.div}
            animate={foodPartnerControls}
            onClick={handleFoodPartnerClick}
            sx={{
              display: 'flex',
              width: 'max-content',
              cursor: 'pointer',
              touchAction: 'pan-x',
              opacity: isFoodPartnerPaused ? 0.8 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {foodPartners.map((logo, index) => (
              <Box
                key={`food-${index}`}
                component={motion.div}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
                sx={{
                  mx: { xs: 1, sm: 2, md: 3 },
                  my: { xs: 1, md: 2 },
                  p: { xs: 1, md: 2 },
                  height: { xs: '80px', sm: '110px', md: '160px' },
                  width: { xs: '120px', sm: '170px', md: '260px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: { xs: '10px', md: '16px' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #FF6B6B',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.15)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '10%',
                  }}
                >
                  <img
                    src={logo}
                    alt={`Food Partner ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(0)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SponsorsMarquee;