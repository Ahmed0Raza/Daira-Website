import React, { createContext, useContext } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const ApprovedAmbassadorContext = createContext();

const ApprovedAmbassadorProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();

  const getAmbassadors = async () => {
    let response = false;
    const tokenData = JSON.parse(localStorage.getItem('adminData'));
    const inviteTokenData = JSON.parse(localStorage.getItem('iAdminData'));

    if (tokenData) {
      await axiosInstance
        .get('/backend/ambassador/ambassadors', {
          headers: {
            Authorization: tokenData.result,
          },
        })
        .then((res) => {
          response = res.data;
        })
        .catch((error) => {
          show(error.message, 'error');
        });
      return response;
    } else {
      await axiosInstance
        .get('/backend/ambassador/ambassadors', {
          headers: {
            Authorization: inviteTokenData.result,
          },
        })
        .then((res) => {
          response = res.data;
        })
        .catch((error) => {
          show(error.message, 'error');
        });
      return response;
    }
  };

  const getAmbassador = async (id) => {
    let response = false;
    const tokenData = JSON.parse(localStorage.getItem('adminData'));
    await axiosInstance
      .get(`/backend/ambassador/ambassador/${id}`, {
        headers: {
          Authorization: tokenData.result,
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

  const contextValues = {
    getAmbassadors,
    getAmbassador,
  };

  return (
    <ApprovedAmbassadorContext.Provider value={contextValues}>
      {children}
    </ApprovedAmbassadorContext.Provider>
  );
};

const useAppAmbassador = () => useContext(ApprovedAmbassadorContext);

export { ApprovedAmbassadorProvider, useAppAmbassador };
