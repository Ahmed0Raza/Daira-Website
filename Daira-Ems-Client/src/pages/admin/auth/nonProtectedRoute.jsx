import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './adminAuth';

const AdminNonLoginRoute = () => {
  const { admin } = useAdminAuth();
  const adminRoute = '/batman/admin';

  if (admin) {
    return <Navigate to={adminRoute + '/'} />;
  }
  return <Outlet />;
};

export default AdminNonLoginRoute;
