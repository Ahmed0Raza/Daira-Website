import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useInvitationAuth } from './invitationsAuth';

const InvitationsProtectedRoute = () => {
  const getStoredToken = () => {
    try {
      const adminDataString = localStorage.getItem('iAdminData');
      if (adminDataString) {
        const adminData = JSON.parse(adminDataString);
        return adminData.result;
      }
    } catch (error) {
      console.error(
        'Error parsing invitations team data from local storage:',
        error
      );
    }
    return null;
  };

  const userData = getStoredToken();
  const { iAdmin, setLoading, setIAdmin } = useInvitationAuth();
  const { show } = useSnackbar();
  const axios = CreateAxiosInstance();
  const invitationRoute = '/coolboi69/invitation';

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      if (userData) {
        try {
          await axios.get(`/backend/invitations/`, {
            headers: {
              authorization: userData,
            },
          });
          setIAdmin(true);
        } catch (error) {
          console.error('User verification error:', error);
          setIAdmin(false);
          localStorage.removeItem('iAdminData');
          show('Authentication failed, please log in again', 'error');
        }
      } else {
        setIAdmin(false);
        // setUser(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return iAdmin ? <Outlet /> : <Navigate to={invitationRoute + '/login'} />;
};

export default InvitationsProtectedRoute;
