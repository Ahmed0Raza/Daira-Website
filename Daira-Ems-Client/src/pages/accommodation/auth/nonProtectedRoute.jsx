import { Navigate, Outlet } from 'react-router-dom';
import { useAccommodationAuth } from './accommodationAuth';

const AccommodationNonLoginRoute = () => {
  const { isAccommodation } = useAccommodationAuth();

  if (isAccommodation) {
    return <Navigate to={'/accommodation/dashboard'} />;
  }
  return <Outlet />;
};

export default AccommodationNonLoginRoute;
