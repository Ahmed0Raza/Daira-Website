import { Box, Container, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../service/eventService';

import business from '../images/BusinessSquare.png';
import creative from '../images/CreativeSquare.png';
import esports from '../images/EsportsSquare.png';
import litrature from '../images/LiteratureSquare.png';
import sports from '../images/SportsSquare.png';
import tech from '../images/TechSquare.png';

const PageContainer = styled(Box)({
  padding: '2rem 1rem',
  minHeight: '100vh',
  marginTop: '100px',
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
});

const Heading = styled(Typography)({
  color: '#fc8b00',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
});

const Underline = styled('div')({
  height: '4px',
  width: '150px',
  background: 'linear-gradient(90deg, #fc8b00, #ffa726)',
  margin: '0 auto 2rem',
  borderRadius: '2px',
  boxShadow: '0 2px 4px rgba(252,139,0,0.2)',
});

const CategoryGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  padding: '2rem',
});

const CategoryCard = styled('div')({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    '& .overlay': {
      opacity: 1,
    },
    '& .category-image': {
      transform: 'scale(1.1)',
    },
  },
});

const CategoryImage = styled('img')({
  width: '100%',
  height: '250px',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
});

const Overlay = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const CategoryTitle = styled(Typography)({
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
});

const imageMap = {
  Business: business,
  Creative: creative,
  'E-sports': esports,
  Literature: litrature,
  Sports: sports,
  Technical: tech,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { getCategory, getEventsByCategory } = useEvent();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategory();
      const filteredCategories = fetchedCategories.filter(
        (category) => category !== 'Social'
      );
      setCategories(filteredCategories);
    };

    fetchCategories();
  }, [getCategory]);

  const handleCategoryClick = async (category) => {
    const events = await getEventsByCategory(category);
    localStorage.setItem('filteredEvents', JSON.stringify(events));
    navigate('/events');
  };

  return (
    <PageContainer>
      <Heading variant="h2">Event Categories</Heading>
      <Underline />
      <CategoryGrid>
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            <CategoryImage
              className="category-image"
              src={imageMap[category]}
              alt={`${category}-image`}
            />
            <Overlay className="overlay">
              <CategoryTitle>{category}</CategoryTitle>
            </Overlay>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </PageContainer>
  );
};

export default Categories;
