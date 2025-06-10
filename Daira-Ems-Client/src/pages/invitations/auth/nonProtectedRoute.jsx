import { Navigate, Outlet } from 'react-router-dom';
import { useInvitationAuth } from './invitationsAuth';

const InvitationsNonLoginRoute = () => {
  const { iAdmin } = useInvitationAuth();
  const invitationRoute = '/coolboi69/invitation';

  if (iAdmin) {
    return <Navigate to={invitationRoute + '/'} />;
  }
  return <Outlet />;
};

export default InvitationsNonLoginRoute;
