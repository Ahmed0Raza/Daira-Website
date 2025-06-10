import React, { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';

const SocietyAuthContext = createContext();

const SocietyAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [isSociety, setIsSociety] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post('/backend/societies/login', data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setLoading(false);
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully', 'success');
        const data = JSON.stringify(response.data);
        localStorage.setItem('isSocietyData', data);
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
    localStorage.removeItem('isSocietyData');
    setIsSociety(false);
    show('Logged out successfully', 'success');
  };

  const contextValues = {
    login,
    logout,
    loading,
    isSociety,
    setIsSociety,
    setLoading,
  };

  return (
    <SocietyAuthContext.Provider value={contextValues}>
      {children}
    </SocietyAuthContext.Provider>
  );
};

const useSocietyAuth = () => {
  const context = useContext(SocietyAuthContext);
  if (!context) {
    throw new Error('useSocietyAuth must be used within a SocietyAuthProvider');
  }
  return context;
};

export { SocietyAuthProvider, useSocietyAuth };
