'use client';

import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import Daira25 from '../images/Daira 2025 (Dark).png';
import Brainyte from '../images/BrainyteLogo1.png';
import { useEffect, useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import BayaanImage from '../images/Bayaan-image.jpg';
import CarImage from '../images/Drift-Car.jpg';

const Background = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
  minHeight: '600px',
  zIndex: 0,
  overflow: 'hidden',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& video': {
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
    zIndex: -1,
    transition: 'opacity 0.8s ease-in-out',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
    zIndex: -1,
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh',
    minHeight: 'unset',
  },
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    minHeight: 'unset',
  },
}));

const TopCenterContent = styled('div')(({ theme }) => ({
  position: 'relative',
  textAlign: 'center',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '500px',
  padding: '0 15px',
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    maxWidth: '90%',
    padding: '0 20px',
  },
}));

// Modified logo container to place logos side by side
const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  marginTop: '15px',
  animation: 'fadeIn 1.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '20px',
    gap: '15px',
  },
}));

// Modified Logo styling with reduced size
const Logo = styled('img')(({ theme }) => ({
  width: '180px', // Reduced from 220px
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '150px', // Reduced from 280px
  },
}));

// Separated PoweredBy container for the Brainyte section
const PoweredByContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const PoweredByText = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: 1,
  fontSize: '0.65rem',
  color: '#fff',
  marginBottom: theme.spacing(0.5),
}));

// Modified BrainyteLogo with reduced size
const BrainyteLogo = styled('img')(({ theme }) => ({
  width: '150px', // Reduced from 120px
  height: 'auto',
  borderRadius: '8px',
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: '#F3E52F',
  fontWeight: 'bold',
  position: 'relative',
  display: 'inline-block',
  padding: '0 10px',
  marginBottom: '15px',
  fontSize: '1.3rem',
  letterSpacing: '1px',
  marginTop: '15px', // Added margin top for spacing
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    width: '25px',
    height: '2px',
    background:
      'linear-gradient(90deg, rgba(243,229,47,0.3) 0%, rgba(243,229,47,1) 50%, rgba(243,229,47,0.3) 100%)',
    transform: 'translateY(-50%)',
  },
  '&::before': {
    left: '-25px',
  },
  '&::after': {
    right: '-25px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    '&::before': {
      width: '25px',
      left: '-30px',
    },
    '&::after': {
      width: '25px',
      right: '-30px',
    },
  },
}));

const TimerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  marginTop: '15px',
  padding: '4px',
  borderRadius: '12px',
  color: '#fff',
  justifyContent: 'center',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    gap: '10px',
    marginTop: '20px',
    padding: '5px',
  },
}));

const TimeBox = styled('div')(({ theme }) => ({
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  padding: '8px 10px',
  minWidth: '55px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const TimeValue = styled('div')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  fontFamily: '"Roboto Mono", monospace',
  letterSpacing: '1px',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F3E52F 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const Label = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: '#F3E52F',
  marginTop: '5px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: '500',
  opacity: 0.9,
}));

const ScrollIndicator = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '25px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  zIndex: 10,
}));

const ScrollText = styled(Typography)(({ theme }) => ({
  color: '#F3E52F',
  fontSize: '0.7rem',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  textShadow: '0 0 10px rgba(243,229,47,0.5)',
}));

const ScrollArrow = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  color: '#F3E52F',
  fontSize: '1.5rem',
  filter: 'drop-shadow(0 0 10px rgba(243,229,47,0.5))',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
}));

const RegisterButton = styled('button')(({ theme }) => ({
  marginTop: '20px',
  padding: '8px 20px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  color: '#000',
  backgroundColor: '#F3E52F',
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(243, 229, 47, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#e6d72d',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(243, 229, 47, 0.5)',
  },
}));

const VideoFallback = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#111',
  zIndex: -1,
  opacity: 0.5,
}));

// FIXED: PopupOverlay component with explicit z-index
const PopupOverlay = ({ children, isOpen, onClose }) => {
  const overlayRef = useRef(null);

  // Handle background click outside popup content
  const handleBackgroundClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      style={{ position: 'fixed', zIndex: 9999 }}
    >
      {children}
    </div>
  );
};

// Dynamic popup data
const popupData = [
  {
    id: 1,
    title: 'Bayaan',
    date: '26-April-2025',
    image: BayaanImage,
    description:
      'Join us for an extraordinary event featuring performances, and networking opportunities.',
  },
  {
    id: 2,
    title: 'Drift Show',
    date: '25-April-2025',
    image: CarImage, // Use the same image for demo, replace with actual image
    description: `Speed meets style in a thrilling display of automotive mastery.
 Witness skilled drifters — only at Daira 2025`,
  },
  // {
  //   id: 3,
  //   title: 'Workshops',
  //   date: '27-April-2025',
  //   image: BayaanImage, // Use the same image for demo, replace with actual image
  //   description:
  //     'Hands-on workshops to learn new skills and enhance your professional development.',
  // },
];

// Navigation buttons for popup slider
const SliderButton = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
      style={{
        [direction === 'prev' ? 'left' : 'right']: '10px',
      }}
    >
      {direction === 'prev' ? (
        <ChevronLeft size={20} />
      ) : (
        <ChevronRight size={20} />
      )}
    </button>
  );
};

// Updated PopupCard component with slider
const PopupCard = ({ onClose }) => {
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const currentPopup = popupData[currentPopupIndex];

  const handlePrev = () => {
    setCurrentPopupIndex((prev) =>
      prev === 0 ? popupData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentPopupIndex((prev) =>
      prev === popupData.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      className="z-50 relative w-full max-w-lg animate-fadeIn overflow-hidden rounded-xl bg-black shadow-2xl"
      onClick={(e) => e.stopPropagation()} // Prevent clicks on card from closing popup
    >
      {/* Close button with fixed click handler */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-30 rounded-full bg-black bg-opacity-25 p-1.5 text-white transition-all hover:bg-opacity-50"
        aria-label="Close popup"
      >
        <X size={20} />
      </button>

      {/* Slider navigation */}
      {popupData.length > 1 && (
        <>
          <SliderButton direction="prev" onClick={handlePrev} />
          <SliderButton direction="next" onClick={handleNext} />
        </>
      )}

      {/* Card content */}
      <div className="flex flex-col md:flex-row">
        <div className="relative h-60 w-full md:h-auto md:w-1/2">
          <img
            src={currentPopup.image}
            alt="Event banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
              {currentPopup.title} on <br className="md:hidden" />
              <span className="text-yellow-300">{currentPopup.date}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-black p-6 md:w-1/2">
          <p className="mb-5 text-center text-gray-300 text-sm font-semibold">
            {currentPopup.description}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation
              window.location.href = '/login';
            }}
            className="rounded-full bg-yellow-400 px-6 py-2 text-base font-bold text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {popupData.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentPopupIndex ? 'bg-yellow-400' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentPopupIndex(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
};

const CustomComponent = () => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const calculateTimeLeft = () => {
    const target = new Date('2025-04-25T00:00:00');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    // Show popup after a short delay
    const popupTimer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 800);

    return () => {
      clearInterval(timer);
      clearTimeout(popupTimer);
    };
  }, []);

  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Background>
        {videoError && <VideoFallback />}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          loop
          muted
          preload="auto"
          style={{ display: videoError ? 'none' : 'block' }}
          onError={() => setVideoError(true)}
        >
          <source
            src="https://res.cloudinary.com/denfhnmvi/video/upload/v1744290625/szl2qmngujmtqs4dqbdm.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <TopCenterContent>
          {/* Modified section with logos side by side */}
          <LogoContainer>
            <Logo src={Daira25} alt="Daira 2025 Logo" />
            <PoweredByContainer>
              <PoweredByText variant="caption">Powered by</PoweredByText>
              <BrainyteLogo src={Brainyte} alt="Brainyte Logo" />
            </PoweredByContainer>
          </LogoContainer>

          <DateText>25 - 27 April, 2025</DateText>

          <TimerWrapper>
            <TimeBox>
              <TimeValue>{timeLeft.days}</TimeValue>
              <Label>Days</Label>
            </TimeBox>
            <TimeBox>
              <TimeValue>{timeLeft.hours}</TimeValue>
              <Label>Hours</Label>
            </TimeBox>
            <TimeBox>
              <TimeValue>{timeLeft.minutes}</TimeValue>
              <Label>Minutes</Label>
            </TimeBox>
            <TimeBox>
              <TimeValue>{timeLeft.seconds}</TimeValue>
              <Label>Seconds</Label>
            </TimeBox>
          </TimerWrapper>

          <RegisterButton
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Register Now
          </RegisterButton>
        </TopCenterContent>

        <ScrollIndicator onClick={handleScroll}>
          <ScrollText>Scroll</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      </Background>

      {/* Add popup components with slider functionality */}
      <PopupOverlay isOpen={isPopupOpen} onClose={closePopup}>
        <PopupCard onClose={closePopup} />
      </PopupOverlay>
    </>
  );
};

export default CustomComponent;