import { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const SocietyContext = createContext();

const SocietyProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();
  const [loading, setLoading] = useState(false);

  const getRegistrationsBySociety = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/societies/registration-statistics',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      show(error.response.data.message, 'error');
      setLoading(false);
    }
  };

  const getParticipantsEventWise = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/societies/participants',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      show(error.response.data.message, 'error');
      setLoading(false);
    }
  };

  const getUnRegisteredParticipants = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/societies/get-unregistered-participants',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      show(error.response.data.message, 'error');
      setLoading(false);
    }
  };

  const getAccomodationCount = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/societies/accomodation',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      show(error.response.data.message, 'error');
      setLoading(false);
    }
  };
  const getparticipantsDetails = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/societies/getparticipantsdetails',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      show('Data Collected!');
      return response.data;
    } catch (error) {
      console.log(error);
      show(error.response.data.message, 'error');
      setLoading(false);
      return false;
    }
  };

  const contextValues = {
    getRegistrationsBySociety,
    loading,
    getParticipantsEventWise,
    getAccomodationCount,
    getparticipantsDetails,
    getUnRegisteredParticipants,
  };

  return (
    <SocietyContext.Provider value={contextValues}>
      {children}
    </SocietyContext.Provider>
  );
};

const useSociety = () => useContext(SocietyContext);

export { SocietyProvider, useSociety };
