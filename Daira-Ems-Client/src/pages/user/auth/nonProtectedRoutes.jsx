import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from './userAuth';

const UserNonLoginRoute = () => {
  const { user } = useUserAuth();

  if (user) {
    return <Navigate to="/ambassador/dashboard" />;
  }
  return <Outlet />;
};

export default UserNonLoginRoute;
