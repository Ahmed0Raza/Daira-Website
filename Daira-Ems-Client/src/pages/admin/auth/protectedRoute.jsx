import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useAdminAuth } from './adminAuth';

const AdminProtectedRoute = () => {
  const userData = JSON.parse(localStorage.getItem('adminData'));
  const { admin, setLoading, setAdmin } = useAdminAuth();
  const { show } = useSnackbar();
  const axios = CreateAxiosInstance();
  const adminRoute = '/batman/admin';
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      if (userData) {
        try {
          await axios.get('/backend/admin', {
            headers: {
              authorization: userData.result,
            },
          });
          setAdmin(true);
        } catch (error) {
          console.error('User verification error:', error);
          setAdmin(false);
          localStorage.removeItem('adminData');
          show('Authentication failed, please log in again', 'error');
        }
      } else {
        setAdmin(false);
        // setUser(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return admin ? <Outlet /> : <Navigate to={adminRoute + '/login'} />;
};

export default AdminProtectedRoute;
