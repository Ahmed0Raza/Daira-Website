import React, { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';

const AdminAuthContext = createContext();

const AdminAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [admin, setAdmin] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post(`/backend/admin/login `, data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully', 'success');
        const data = JSON.stringify(response.data);
        localStorage.setItem('adminData', data);
        setLoading(false);
      })
      .catch((error) => {
        show(error.response.data.message, 'error');
        valid = false;
      });
    return valid;
  };

  const logout = () => {
    localStorage.removeItem('adminData');
    setAdmin(false);
    show('Logged out successfully', 'success');
  };

  const getStatistics = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/backend/admin/statistics`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      show(error.response.data.message, 'error');
      throw error;
    }
  };

  const contextValues = {
    login,
    logout,
    loading,
    admin,
    setAdmin,
    setLoading,
    getStatistics,
  };

  return (
    <AdminAuthContext.Provider value={contextValues}>
      {children}
    </AdminAuthContext.Provider>
  );
};

const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within a AdminAuthProvider');
  }
  return context;
};

export { AdminAuthProvider, useAdminAuth };
