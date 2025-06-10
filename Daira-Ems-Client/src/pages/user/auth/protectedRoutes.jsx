import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from './userAuth';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import CreateAxiosInstance from '../../../utils/axiosInstance';

const UserProtectedRoute = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const { user, setLoading, setUser } = useUserAuth();
  const { show } = useSnackbar();
  const axios = CreateAxiosInstance();

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);

      if (userData) {
        try {
          await axios.get(`/backend/auth/verifyToken`, {
            headers: {
              Authorization: `Bearer ${userData.data.token}`,
            },
          });
          setUser(true);
        } catch (error) {
          console.error('User verification error:', error);
          setUser(false);
          localStorage.removeItem('userData');
          show('Authentication failed, please log in again', 'error');
        }
      } else {
        setUser(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default UserProtectedRoute;
