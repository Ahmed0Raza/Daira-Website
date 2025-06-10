import React, { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';
const AgentAuthContext = createContext();

const AgentAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [agent, setAgent] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post(`/backend/agent/login`, data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully', 'success');
        const data = JSON.stringify(response.data);
        console.log(data)
        localStorage.setItem('agentData', data);
        setLoading(false);
      })
      .catch((error) => {
        show(error.response.data.message, 'error');
        valid = false;
      });
    return valid;
  };

  const logout = () => {
    localStorage.removeItem('agentData');
    setAgent(false);
    show('Logged out successfully', 'success');
  };

  const contextValues = {
    login,
    logout,
    loading,
    agent,
    setAgent,
    setLoading,
  };

  return (
    <AgentAuthContext.Provider value={contextValues}>
      {children}
    </AgentAuthContext.Provider>
  );
};

const useAgentAuth = () => {
  const context = useContext(AgentAuthContext);
  if (!context) {
    throw new Error('useAgentAuth must be used within a AgentAuthProvider');
  }
  return context;
};

export { AgentAuthProvider, useAgentAuth };
