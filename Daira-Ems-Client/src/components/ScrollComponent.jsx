import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ModernScrollSection = () => {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const panels = panelsRef.current;

    // Create a timeline for the main horizontal scroll
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => '+=' + container.offsetWidth * (panels.length - 1),
        invalidateOnRefresh: true,
      },
    });

    // Create staggered text reveal animations for each panel
    panels.forEach((panel, i) => {
      const textElements = panel.querySelectorAll('.animate-text');

      gsap.fromTo(
        textElements,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleRegister = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      navigate('/ambassador/manageParticipants');
    } else {
      navigate('/ambassador/manageParticipants');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflowX: 'hidden',
        background: '#111',
        color: '#fff',
      }}
    >
      {/* Color bars - decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '5px',
          height: '100%',
          background: 'linear-gradient(to bottom, #AD21B0, #FF5B14)',
          zIndex: 5,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '5px',
          background: 'linear-gradient(to right, #AD21B0, #FF5B14)',
          zIndex: 5,
        }}
      />

      {/* Main container */}
      <Box
        ref={containerRef}
        sx={{
          height: '100vh',
          width: '400vw',
          display: 'flex',
          flexWrap: 'nowrap',
        }}
        className="scroll-container"
      >
        {/* Panel 1 */}
        <Box
          ref={(el) => (panelsRef.current[0] = el)}
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            position: 'relative',
          }}
        >
          <Box sx={{ maxWidth: '1200px', position: 'relative', zIndex: 2 }}>
            <Typography
              className="animate-text"
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '3rem', sm: '5rem', md: '8rem' },
                textTransform: 'uppercase',
                background: 'linear-gradient(45deg, #AD21B0 30%, #FF5B14 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Discover
            </Typography>
            <Typography
              className="animate-text"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                maxWidth: '600px',
                color: '#ccc',
                mt: 2,
              }}
            >
              Scroll to explore Faisalabad's premier academic competition
              challenging the brightest minds.
            </Typography>
          </Box>
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              right: '10%',
              bottom: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(173, 33, 176, 0.1)',
              filter: 'blur(60px)',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Panel 2 */}
        <Box
          ref={(el) => (panelsRef.current[1] = el)}
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            className="animate-text"
            sx={{
              fontSize: { xs: '3rem', sm: '8rem', md: '10rem' },
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              textShadow: '6px 6px 0px rgba(173, 33, 176, 0.5)',
              letterSpacing: '-0.05em',
              zIndex: 2,
            }}
          >
            Faisalabad's
          </Typography>

          {/* Background patterns */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(circle at 30% 30%, rgba(173, 33, 176, 0.15), transparent 500px)',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Panel 3 */}
        <Box
          ref={(el) => (panelsRef.current[2] = el)}
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#AD21B0',
            position: 'relative',
          }}
        >
          <Typography
            className="animate-text"
            sx={{
              fontSize: { xs: '5rem', sm: '10rem', md: '17rem' },
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              textShadow: '0 0 30px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            Biggest
          </Typography>

          {/* Animated background gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, rgba(173, 33, 176, 0.8) 0%, rgba(255, 91, 20, 0.8) 100%)',
              opacity: 0.9,
              zIndex: -1,
            }}
          />
        </Box>

        {/* Panel 4 */}
        <Box
          ref={(el) => (panelsRef.current[3] = el)}
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            className="animate-text"
            sx={{
              fontSize: { xs: '4rem', sm: '8rem', md: '12rem' },
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              mb: 4,
              textShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          >
            Olympiad
          </Typography>

          <Button
            className="animate-text"
            onClick={handleRegister}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            sx={{
              mt: 4,
              py: 2,
              px: 6,
              fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 700,
              color: '#111',
              background: 'white',
              borderRadius: '50px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 10px 30px rgba(173, 33, 176, 0.5)',
                background: '#ffffff',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              Register Now
              <ChevronRight
                size={24}
                style={{
                  transform: isHovering ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
          </Button>

          {/* Background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.8,
              background:
                'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)',
              zIndex: -2,
            }}
          />

          {/* Decorative circles */}
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: { xs: '200px', md: '400px' },
                height: { xs: '200px', md: '400px' },
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #AD21B0, #FF5B14)',
                opacity: 0.1,
                filter: 'blur(60px)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: -1,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ModernScrollSection;
