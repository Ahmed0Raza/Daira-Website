import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useAccommodationAuth } from './accommodationAuth';

const AccommodationProtectedRoute = () => {
  const userData = JSON.parse(localStorage.getItem('isAccommodationData'));
  const { isAccommodation, setLoading, setIsAccommodation } = useAccommodationAuth();
  const { show } = useSnackbar();
  const axios = CreateAxiosInstance();

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      if (userData) {
        try {
          const res = await axios.get('/backend/accommodations/verify', {
            headers: {
              authorization: userData.result,
            },
          });
          if (res.status === 200) {
            setIsAccommodation(true);
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.error('User verification error:', error);
          setIsAccommodation(false);
          localStorage.removeItem('isAccommodationData');
          console.log(localStorage.getItem('isAccommodationData'))
          show('Authentication failed, please log in again', 'error');
        }
      } else {
        setIsAccommodation(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  return isAccommodation ? (
    <Outlet />
  ) : (
    <Navigate to={`/accommodation/login`} />
  );
};

export default AccommodationProtectedRoute;
