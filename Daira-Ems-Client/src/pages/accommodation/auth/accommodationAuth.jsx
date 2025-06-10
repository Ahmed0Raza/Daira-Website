import React, { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';

const AccommodationAuthContext = createContext();

const AccommodationAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [isAccommodation, setIsAccommodation] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post('/backend/accommodations/login', data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setLoading(false);
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully', 'success');
        const data = JSON.stringify(response.data);
        localStorage.setItem('isAccommodationData', data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        show(error.response.data.message, 'error');
        valid = false;
      });
    return valid;
  };

  const logout = () => {
    localStorage.removeItem('isAccommodationData');
    setIsAccommodation(false);
    show('Logged out successfully', 'success');
  };

  const contextValues = {
    login,
    logout,
    loading,
    isAccommodation,
    setIsAccommodation,
    setLoading,
  };

  return (
    <AccommodationAuthContext.Provider value={contextValues}>
      {children}
    </AccommodationAuthContext.Provider>
  );
};

const useAccommodationAuth = () => {
  const context = useContext(AccommodationAuthContext);
  if (!context) {
    throw new Error(
      'useAccommodationAuth must be used within a AccommodationAuthProvider'
    );
  }
  return context;
};

export { AccommodationAuthProvider, useAccommodationAuth };
