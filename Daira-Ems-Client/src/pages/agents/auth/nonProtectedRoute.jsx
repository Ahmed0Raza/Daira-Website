import { Navigate, Outlet } from 'react-router-dom';
import { useAgentAuth } from './agentAuth';

const AgentNonLoginRoute = () => {
  const { agent } = useAgentAuth();
  if (agent) {
    return <Navigate to={'/agents/dashboard'} />;
  }
  return <Outlet />;
};

export default AgentNonLoginRoute;
