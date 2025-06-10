'use client';

import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import {
  Calendar,
  MapPin,
  Clock,
  Music,
  Car,
  Music2,
  PawPrint,
  Sunrise,
  Feather,
  Mic,
  Instagram,
  Facebook,
  MessageCircleMore,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import Daira25 from '../images/Daira 2025 (Dark).png';
import BayaanImage from '../images/Bayaan-image.jpg';
// Replace with actual drift show image once available
import DriftShowImage from '../images/Drift-Car.jpg';
import QawaliImage from '../images/Social-Qawali.jpg';
import CelebratyImage from '../images/Social-Celebraty.jpg';
import PetImage from '../images/Social-Pet.jpg';
import MushairaImage from '../images/Social-Mushaira.jpg';
import DawnImage from '../images/Social-DawnDelight.jpg';
import SocialsImg1 from '../images/Socials-img1.jpg';
import SocialsImg2 from '../images/Socials-img2.jpg';
import SocialsImg3 from '../images/Socials-img3.jpg';
import SocialsImg4 from '../images/Socials-img4.jpg';

// Styled components
const PageContainer = styled('div')({
  paddingTop: '10vh',
  background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  minHeight: '100vh',
  color: '#fff',
  fontFamily: '"Inter", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // Prevent horizontal overflow
  width: '100%',
  position: 'relative',
});

const MainContent = styled('main')({
  flex: '1 0 auto',
  width: '100%',
  padding: '2rem 0',
  overflow: 'hidden',
});

const HeaderSection = styled('div')({
  textAlign: 'center',
  padding: '2rem 0 4rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Logo = styled('img')({
  maxWidth: '220px',
  marginBottom: '1rem',
});

const Heading = styled('h1')({
  fontSize: '3rem',
  fontWeight: '800',
  background: 'linear-gradient(to right, #F3E52F, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0.5rem 0',
  position: 'relative',
  display: 'inline-block',
  letterSpacing: '1px',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: '-10px',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '3px',
    background: 'linear-gradient(to right, #F3E52F, #FFD700)',
    borderRadius: '2px',
  },
});

const Subheading = styled('p')({
  fontSize: '1.2rem',
  color: '#e0e0e0',
  maxWidth: '800px',
  margin: '2rem auto',
  lineHeight: '1.6',
  paddingLeft: '2px',
  paddingRight: '2px',
});

const EventsContainer = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  overflowX: 'hidden', // Prevent horizontal scrolling
});

const EventCard = styled(motion.div)({
  borderRadius: '1.5rem',
  overflow: 'hidden',
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  margin: '3rem 0',
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    height: '500px',
  },
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  width: '100%', // Ensure card doesn't overflow its container
});

const EventImageContainer = styled('div')({
  position: 'relative',
  height: '300px',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    width: '55%',
    height: 'auto',
  },
});

const EventImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.8s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const EventOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
  zIndex: 1,
});

const EventContent = styled('div')({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '@media (min-width: 768px)': {
    width: '45%',
  },
  position: 'relative',
});

const EventLabel = styled('span')({
  display: 'inline-block',
  padding: '0.5rem 1rem',
  borderRadius: '2rem',
  backgroundColor: '#F3E52F',
  color: '#000',
  fontWeight: '600',
  fontSize: '0.9rem',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const EventTitle = styled('h2')({
  fontSize: '2.2rem',
  fontWeight: '700',
  marginBottom: '1rem',
  lineHeight: '1.2',
  color: '#fff',
});

const EventDescription = styled('p')({
  fontSize: '1.05rem',
  color: '#d0d0d0',
  lineHeight: '1.7',
  marginBottom: '2rem',
});

const EventDetails = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem',
});

const DetailItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '1rem',
  color: '#e0e0e0',
  '& svg': {
    color: '#F3E52F',
  },
});

const EventActions = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: 'auto',
  marginBottom: '1.5rem', // Added more space at the bottom of the button
});

const SocialShare = styled('div')({
  position: 'absolute',
  right: '2rem',
  top: '2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

const SocialButton = styled('a')({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#F3E52F',
    color: '#000',
    transform: 'translateY(-3px)',
  },
});

const EventTag = styled('span')({
  position: 'absolute',
  left: '0',
  top: '2rem',
  backgroundColor: '#F3E52F',
  color: '#000',
  padding: '0.5rem 1.5rem 0.5rem 1rem',
  borderTopRightRadius: '2rem',
  borderBottomRightRadius: '2rem',
  fontWeight: '600',
  fontSize: '0.9rem',
  zIndex: 10,
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const GallerySection = styled('div')({
  maxWidth: '1200px',
  margin: '6rem auto 3rem',
  padding: '0 2rem',
  overflowX: 'hidden', // Prevent horizontal scrolling
});

const GalleryHeading = styled('h2')({
  fontSize: '2.5rem',
  fontWeight: '700',
  marginBottom: '2rem',
  textAlign: 'center',
  color: '#fff',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: '-10px',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: 'linear-gradient(to right, #F3E52F, #FFD700)',
    borderRadius: '2px',
  },
});

const GalleryContainer = styled('div')({
  position: 'relative',
  height: '350px',
  borderRadius: '1rem',
  overflow: 'hidden',
});

const GalleryControls = styled('div')({
  position: 'absolute',
  bottom: '1.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '0.5rem',
  zIndex: 10,
});

const GalleryDot = styled('button')(({ active }) => ({
  width: active ? '2rem' : '0.75rem',
  height: '0.75rem',
  borderRadius: active ? '1rem' : '50%',
  backgroundColor: active ? '#F3E52F' : 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: active ? '#F3E52F' : 'rgba(255, 255, 255, 0.8)',
  },
}));

const GalleryArrow = styled('button')(({ direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [direction === 'left' ? 'left' : 'right']: '1rem',
  zIndex: 10,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#F3E52F',
    color: '#000',
  },
}));

// Main Component
const SocialsPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const galleryImages = [SocialsImg1, SocialsImg2, SocialsImg3, SocialsImg4];

  // Event data array - this makes the cards dynamic
  const events = [
    {
      id: 1,
      tagIcon: <Music size={16} />,
      tagText: 'Featured Event',
      image: BayaanImage,
      imageAlt: 'Bayaan Concert',
      label: 'Live Concert',
      title: 'Bayaan Live in Concert',
      description:
        "Experience the spellbinding performance of Bayaan, one of Pakistan's most acclaimed musical groups. Get ready for an unforgettable night of soulful melodies, powerful lyrics, and electric energy that will leave you mesmerized.",
      details: [
        { icon: <Calendar size={18} />, text: '26th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Cricket Ground, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '7:00 PM Onwards' },
      ],
      buttonText: 'Book Tickets',
      buttonLink: '/login',
    },
    {
      id: 2,
      tagIcon: <Car size={16} />,
      tagText: 'Thrilling Show',
      image: DriftShowImage,
      imageAlt: 'Drift Show',
      label: 'Motorsport',
      title: 'Professional Drift Show',
      description:
        'Witness the adrenaline-pumping action as professional drivers showcase their exceptional skills, performing breathtaking drifts, controlled slides, and spectacular maneuvers that will leave you at the edge of your seat.',
      details: [
        { icon: <Calendar size={18} />, text: '25th April, 2025' },
        { icon: <MapPin size={18} />, text: 'FAST University, Faisalabad' },
        { icon: <Clock size={18} />, text: '2:00 PM - 5:00 PM' },
      ],
      buttonText: 'Register Now',
      buttonLink: '/login',
    },
    {
      id: 3,
      tagIcon: <Music2 size={16} />,
      tagText: 'Soulful Evening',
      image: QawaliImage,
      imageAlt: 'Qawali Night',
      label: 'Cultural',
      title: 'Sufi Qawali Night',
      description:
        'Immerse yourself in the spiritual and musical journey of Qawali as renowned artists take the stage, delivering heart-touching verses and rhythmic beats that resonate with centuries of tradition.',
      details: [
        { icon: <Calendar size={18} />, text: '25th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Cricket Ground, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '6:00 PM Onwards' },
      ],
      buttonText: 'Reserve Your Spot',
      buttonLink: '/login',
    },
    {
      id: 4,
      tagIcon: <Mic size={16} />,
      tagText: 'Star-Studded',
      image: CelebratyImage,
      imageAlt: 'Celebrity Talk Show',
      label: 'Talk Show',
      title: 'Celebrity Talk Show',
      description:
        'Get up close and personal with your favorite celebrities as they share behind-the-scenes stories, career journeys, and inspiring experiences in a candid, interactive session.',
      details: [
        { icon: <Calendar size={18} />, text: '26th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Auditorium, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '1:00 PM' },
      ],
      buttonText: 'Reserve Seat',
      buttonLink: '/login',
    },
    {
      id: 5,
      tagIcon: <Feather size={16} />,
      tagText: 'Poetic Night',
      image: MushairaImage,
      imageAlt: 'Mushaira Night',
      label: 'Literature',
      title: 'Mushaira Evening',
      description:
        'Celebrate the beauty of Urdu literature as esteemed poets gather to share verses that speak of love, life, resistance, and culture in a captivating literary gathering.',
      details: [
        { icon: <Calendar size={18} />, text: '25th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Auditorium, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '5:00 PM' },
      ],
      buttonText: 'Experience Poetry',
      buttonLink: '/login',
    },
    {
      id: 6,
      tagIcon: <PawPrint size={16} />,
      tagText: 'Animal Fun',
      image: PetImage,
      imageAlt: 'Pet Show',
      label: 'Entertainment',
      title: 'Pet Show',
      description:
        'Bring the whole family to enjoy a delightful day featuring adorable pets from all over. Witness talent contests, agility games, and get a chance to meet local pet lovers and experts.',
      details: [
        { icon: <Calendar size={18} />, text: '26th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Front Lawn, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '10:00 AM - 6:00 PM' },
      ],
      buttonText: 'Join the Fun',
      buttonLink: '/login',
    },
    {
      id: 7,
      tagIcon: <Sunrise size={16} />,
      tagText: 'Morning Bliss',
      image: DawnImage,
      imageAlt: 'Dawn Delight',
      label: 'Health & Wellness',
      title: 'Dawn Delight',
      description:
        'Start your day with serenity. Join us for a delightful breakfast spread in the fresh air among peers and nature.',
      details: [
        { icon: <Calendar size={18} />, text: '27th April, 2025' },
        {
          icon: <MapPin size={18} />,
          text: 'FAST University Food Street, Faisalabad',
        },
        { icon: <Clock size={18} />, text: '6:00 AM' },
      ],
      buttonText: 'Start Fresh',
      buttonLink: '/login',
    },
  ];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Modify the animation variants to be less dramatic and minimize layout shifts
  const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y distance to minimize layout shift
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // Slightly faster transition
        ease: 'easeOut',
      },
    },
  };

  // Add this effect to address potential scrolling issues
  useEffect(() => {
    // Prevent body scrolling issues that might be caused by Framer Motion
    document.body.style.overflowX = 'hidden';

    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '0px',
        }}
      >
        <Header />
      </Box>
      <PageContainer>
        <MainContent>
          <HeaderSection>
            <Logo src={Daira25} alt="Daira 2025 Logo" />
            <Heading>Daira 2025 Social Events</Heading>
            <Subheading>
              Immerse yourself in the extraordinary world of Daira 2025,
              featuring exclusive performances, thrilling shows, and
              unforgettable experiences that will leave you spellbound.
            </Subheading>
          </HeaderSection>

          <EventsContainer>
            {/* Dynamically render event cards */}
            {events.map((event) => (
              <EventCard
                key={event.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }} // Reduced amount to trigger animation earlier
                variants={cardVariants}
                layout // Adding layout prop to help with smoother transitions
              >
                <EventTag>
                  {event.tagIcon}
                  {event.tagText}
                </EventTag>
                <EventImageContainer>
                  <EventImage src={event.image} alt={event.imageAlt} />
                  <EventOverlay />
                </EventImageContainer>
                <EventContent>
                  <div>
                    <EventLabel>{event.label}</EventLabel>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDescription>{event.description}</EventDescription>
                    <EventDetails>
                      {event.details.map((detail, index) => (
                        <DetailItem key={index}>
                          {detail.icon}
                          <span>{detail.text}</span>
                        </DetailItem>
                      ))}
                    </EventDetails>
                  </div>
                </EventContent>
                <SocialShare>
                  <SocialButton
                    href="https://www.instagram.com/fast.daira/"
                    aria-label="Share on Instagram"
                    target="_blank"
                  >
                    <Instagram size={18} />
                  </SocialButton>
                  <SocialButton
                    href="https://www.facebook.com/fast.daira"
                    aria-label="Share on Facebook"
                    target="_blank"
                  >
                    <Facebook size={18} />
                  </SocialButton>
                  <SocialButton
                    href="https://wa.link/gusjoy"
                    aria-label="Chat on whatsapp"
                    target="_blank"
                  >
                    <MessageCircleMore size={18} />
                  </SocialButton>
                </SocialShare>
              </EventCard>
            ))}
          </EventsContainer>

          <GallerySection>
            <GalleryHeading>Daira'23-24 Highlights</GalleryHeading>
            <GalleryContainer>
              <AnimatePresence mode="wait">
                {galleryImages.map(
                  (img, index) =>
                    index === currentImage && (
                      <motion.img
                        key={index}
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '1rem',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )
                )}
              </AnimatePresence>
              <GalleryArrow direction="left" onClick={prevImage}>
                <ChevronLeft size={20} />
              </GalleryArrow>
              <GalleryArrow direction="right" onClick={nextImage}>
                <ChevronRight size={20} />
              </GalleryArrow>
              <GalleryControls>
                {galleryImages.map((_, index) => (
                  <GalleryDot
                    key={index}
                    active={index === currentImage}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </GalleryControls>
            </GalleryContainer>
          </GallerySection>
        </MainContent>

        <Footer />
      </PageContainer>
    </>
  );
};

export default SocialsPage;
