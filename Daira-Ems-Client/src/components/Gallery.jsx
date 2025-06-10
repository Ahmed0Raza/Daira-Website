'use client';

import { Typography, styled, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import g1 from '../images/g1.jpg';
import g2 from '../images/g2.jpeg';
import g3 from '../images/g3.jpeg';
import g4 from '../images/g4.jpeg';
import g5 from '../images/g5.jpeg';
import ge from '../images/ge.jpeg';

const Container = styled('div')(({ theme }) => ({
  padding: '50px 20px',
  background: 'linear-gradient(to bottom, #f9f9f9, #ffffff)',
  [theme.breakpoints.up('md')]: {
    padding: '100px 50px',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: '#301C5F',
  fontWeight: 'bold',
  textAlign: 'center',
  position: 'relative',
  marginBottom: '40px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: '#F3E52F',
  },
  fontSize: '24px',
  [theme.breakpoints.up('md')]: {
    fontSize: '32px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '58px',
  },
}));

const ImageContainer = styled(motion.div)({
  overflow: 'hidden',
  borderRadius: '12px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

export default function Galleryy() {
  const theme = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Container>
      <StyledTitle variant="h3">OPENING CEREMONY</StyledTitle>
      <section className="overflow-hidden text-gray-700" ref={ref}>
        <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
          <motion.div
            className="flex flex-wrap -m-1 md:-m-2"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div className="flex flex-wrap w-1/2">
              <div className="w-1/2 p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={g1 || '/placeholder.svg'} />
                </ImageContainer>
              </div>
              <div className="w-1/2 p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={g2 || '/placeholder.svg'} />
                </ImageContainer>
              </div>
              <div className="w-full p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={g3 || '/placeholder.svg'} />
                </ImageContainer>
              </div>
            </div>
            <div className="flex flex-wrap w-1/2">
              <div className="w-full p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={g5 || '/placeholder.svg'} />
                </ImageContainer>
              </div>
              <div className="w-1/2 p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={g4 || '/placeholder.svg'} />
                </ImageContainer>
              </div>
              <div className="w-1/2 p-1 md:p-2">
                <ImageContainer variants={itemVariants}>
                  <StyledImage alt="gallery" src={ge || '/placeholder.svg'} />
                </ImageContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Container>
  );
}
