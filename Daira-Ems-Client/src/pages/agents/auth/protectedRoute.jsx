import { useAgentAuth } from './agentAuth';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import CreateAxiosInstance from '../../../utils/axiosInstance';

const AgentProtectedRoute = () => {
  const userData = JSON.parse(localStorage.getItem('agentData'));
  const { agent, setLoading, setAgent } = useAgentAuth();
  const { show } = useSnackbar();
  const axios = CreateAxiosInstance();

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      if (userData) {
        try {
          const res = await axios.get('/backend/agent/verifyToken', {
            headers: {
              authorization: userData.result,
            },
          });
          if (res.status === 200) {
            setAgent(true);
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.error('User verification error:', error);
          setAgent(false);
          localStorage.removeItem('agentData');
          show('Authentication failed, please log in again', 'error');
        }
      } else {
        setAgent(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return agent ? <Outlet /> : <Navigate to="/agents/login" replace />;
};

export default AgentProtectedRoute;
