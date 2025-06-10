import React, { createContext, useContext } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const AmbassadorContext = createContext();

const AmbassadorProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();

  const getStoredToken = () => {
    try {
      let adminDataString = localStorage.getItem('adminData');
      if (!adminDataString) {
        adminDataString = localStorage.getItem('iAdminData');
      }
      if (adminDataString) {
        const adminData = JSON.parse(adminDataString);
        return adminData.result;
      }
    } catch (error) {
      console.error('Error parsing admin data from local storage:', error);
    }
    return null; // Return null if there's no token or in case of an error
  };

  const jwt = getStoredToken();

  const getActiveAmbassadors = async () => {
    let response = false;
    await axiosInstance
      .get('/backend/ambassador-nomination/activeAmbassadors')
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const getAmbassadors = async () => {
    let response = false;
    await axiosInstance
      .get('/backend/ambassador-nomination/')
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const getAmbassador = async (id) => {
    let response = false;
    await axiosInstance
      .get(`/backend/ambassador-nomination/getAmbassador/${id}`)
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const createAmbassador = async (data) => {
    let response = false;
    await axiosInstance
      .post('/backend/ambassador-nomination/', data)
      .then((res) => {
        response = res.data;
        show('Nomination created successfully', 'success');
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const approveAmbassador = async (id) => {
    let response = false;
    await axiosInstance
      .post(
        '/backend/ambassador-nomination/approve/',
        { id },
        {
          headers: {
            Authorization: `${jwt}`,
          },
        }
      )
      .then((res) => {
        response = res.data;
        show('Ambassador approved successfully', 'success');
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const signupAmbassador = async (data) => {
    let response = false;
    await axiosInstance
      .post('/backend/ambassador-nomination/ambassadorSignup', data)
      .then((res) => {
        response = res.data;
        show('Ambassador approved successfully', 'success');
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const verifyToken = async (token) => {
    let response = false;
    await axiosInstance
      .get('/backend/ambassador-nomination/verify', {
        params: {
          token,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const updateAmbassador = async (id, data) => {
    let response = false;
    await axiosInstance
      .put(`/backend/ambassador-nomination/update/${id}`, data, {
        headers: {
          Authorization: `${jwt}`,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const getAllAmbassadors = async () => {
    let response = false;
    await axiosInstance
      .get('/backend/ambassador/ambassadors', {
        headers: {
          Authorization: `${jwt}`,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };
  const getAllAmbassadorsParticitants = async () => {
    let response = false;
    await axiosInstance
      .get('/backend/ambassador/getAmbassadorParticipants', {
        headers: {
          Authorization: `${jwt}`,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };
  const getAmbassadorData = async (token, ambassadorId) => {
    const response = await axiosInstance
      .get(`/backend/registeration/ambassador-statistics/${ambassadorId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        show(error.message, 'error');
        return false;
      });
    return response;
  };

  const contextValues = {
    getAmbassadors,
    getAmbassador,
    createAmbassador,
    approveAmbassador,
    signupAmbassador,
    updateAmbassador,
    verifyToken,
    getActiveAmbassadors,
    getAllAmbassadors,
    getAmbassadorData,
    getAllAmbassadorsParticitants,
  };

  return (
    <AmbassadorContext.Provider value={contextValues}>
      {children}
    </AmbassadorContext.Provider>
  );
};

const useAmbassador = () => useContext(AmbassadorContext);

export { AmbassadorProvider, useAmbassador };
