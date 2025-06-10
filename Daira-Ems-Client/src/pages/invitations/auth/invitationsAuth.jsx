import React, { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
const InvitationsAuthContext = createContext();

const InvitationsAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [iAdmin, setIAdmin] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post('/backend/invitations/login', data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setLoading(false);
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully');
        const data = JSON.stringify(response.data);
        localStorage.setItem('iAdminData', data);
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
    localStorage.removeItem('iAdminData');
    setIAdmin(false);
    show('Logged out successfully', 'success');
  };

  const contextValues = {
    login,
    logout,
    loading,
    iAdmin,
    setIAdmin,
    setLoading,
  };

  return (
    <InvitationsAuthContext.Provider value={contextValues}>
      {children}
    </InvitationsAuthContext.Provider>
  );
};

const useInvitationAuth = () => {
  const context = useContext(InvitationsAuthContext);
  if (!context) {
    throw new Error(
      'useInvitationAuth must be used within a InvitationsAuthProvider'
    );
  }
  return context;
};

export { InvitationsAuthProvider, useInvitationAuth };
