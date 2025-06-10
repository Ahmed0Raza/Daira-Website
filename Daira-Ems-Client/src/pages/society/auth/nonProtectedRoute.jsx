import { Navigate, Outlet } from 'react-router-dom';
import { useSocietyAuth } from './societyAuth';

const SocietyNonLoginRoute = () => {
  const { isSociety } = useSocietyAuth();
  const societyRoute = '/coolboi69';

  if (isSociety) {
    return <Navigate to={societyRoute + '/analytics'} />;
  }
  return <Outlet />;
};

export default SocietyNonLoginRoute;
