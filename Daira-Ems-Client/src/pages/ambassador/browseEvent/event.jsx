import React from 'react';
import UnderConstruction from '../../../utils/underconstruction';
import { useNavigate } from 'react-router-dom';

const BrowseEvents = () => {
  const navigate = useNavigate();
  navigate('/categories');
};

export default BrowseEvents;
