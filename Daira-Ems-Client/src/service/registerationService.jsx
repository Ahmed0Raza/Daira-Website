import React, { createContext, useContext, useState, useCallback } from 'react';
import createAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const RegistrationContext = createContext();

const RegistrationProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = createAxiosInstance();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  const handleLoading = useCallback(async (operation) => {
    try {
      setLoading(true);
      const result = await operation();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const addParticipant = useCallback(
    async (data, token) => {
      try {
        const response = await axiosInstance.post(
          '/backend/registeration/add-participant',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        setParticipants((prevParticipants) => [
          ...prevParticipants,
          response.data,
        ]);
        setHasFetched(false);
        setUpdateTrigger((prev) => !prev);
        show(response.data.message, 'success');
      } catch (error) {
        show(
          error.response?.data?.message || 'Failed to add participant',
          'error'
        );
      }
    },
    [axiosInstance, show]
  );

  const getParticipantsByiD = useCallback(
    async (id, token) => {
      if (hasFetched) return participants;

      return handleLoading(async () => {
        const response = await axiosInstance.get(
          `/backend/registeration/participants/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        setParticipants(response.data.participants);
        setHasFetched(true);
        return response.data.participants;
      });
    },
    [axiosInstance, handleLoading, hasFetched, participants]
  );

  const deleteParticipant = useCallback(
    async (id, token) => {
      try {
        const response = await axiosInstance.delete(
          `/backend/registeration/delete-participant/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant._id !== id)
        );
        setUpdateTrigger((prev) => !prev);
        return true;
      } catch (error) {
        return false;
      }
    },
    [axiosInstance]
  );

  const getRegistrationsByUserId = useCallback(
    async (id, token) => {
      return handleLoading(async () => {
        const response = await axiosInstance.get(
          `/backend/registeration/registrations/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data.registrations;
      });
    },
    [axiosInstance, handleLoading]
  );

  const getRegisterationInfo = useCallback(
    async (id, token) => {
      return handleLoading(async () => {
        const response = await axiosInstance.get(
          `/backend/registeration/registration-info/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      });
    },
    [axiosInstance, handleLoading]
  );

  const getEventCategoies = useCallback(
    async (token) => {
      try {
        const response = await axiosInstance.get(
          '/backend/registeration/event-categories',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data.categories;
      } catch (error) {
        console.error(error.response.data.message);
        return null;
      }
    },
    [axiosInstance]
  );

  const getEventsByCategory = useCallback(
    async (token, category) => {
      try {
        const response = await axiosInstance.get(
          `/backend/registeration/events/${category}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data.events;
      } catch (error) {
        console.error(error.response.data.message);
        return null;
      }
    },
    [axiosInstance]
  );

  const getEventDetails = useCallback(
    async (token, name) => {
      try {
        const response = await axiosInstance.get(
          `/backend/registeration/eventsdetails/${name}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data.events;
      } catch (error) {
        return null;
      }
    },
    [axiosInstance]
  );

  const registerTeam = useCallback(
    async (
      token,
      userId,
      teamName,
      eventId,
      participants,
      captchaValue,
      payableAmount
    ) => {
      return handleLoading(async () => {
        const response = await axiosInstance.post(
          `/backend/registeration/register-team`,
          {
            userId,
            teamName,
            eventId,
            participants,
            captchaValue,
            payable: payableAmount,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return { success: true, msg: 'Team Registered' };
      });
    },
    [axiosInstance, handleLoading]
  );

  const getAmountPayable = useCallback(
    async (data, token) => {
      try {
        const response = await axiosInstance.post(
          '/backend/registeration/amount-payable',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data.amount;
      } catch (error) {
        console.error(error.response.data.message);
        return null;
      }
    },
    [axiosInstance]
  );

  const deleteEventByID = useCallback(
    async (id, token) => {
      try {
        const response = await axiosInstance.delete(
          `/backend/registeration/delete-event/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        show(response.data.message, 'success');
        setUpdateTrigger((prev) => !prev);
      } catch (error) {
        show(error.response.data.message, 'error');
      }
    },
    [axiosInstance, show]
  );

  const getRegistrationByID = useCallback(
    async (userId, token) => {
      return handleLoading(async () => {
        const response = await axiosInstance.get(`/registrations/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });
        return response.data;
      });
    },
    [axiosInstance, handleLoading]
  );

  const generateInvoice = useCallback(
    async (userId, token) => {
      try {
        const response = await axiosInstance.get(
          `/backend/registeration/generate-invoice/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(error.response.data.message);
        return null;
      }
    },
    [axiosInstance]
  );

  const getStatistics = useCallback(
    async (userId, token) => {
      return handleLoading(async () => {
        const response = await axiosInstance.get(
          `/backend/registeration/dashboard-statistics/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      });
    },
    [axiosInstance, handleLoading]
  );

  const deleteRegisterations = useCallback(
    async (id, token) => {
      try {
        const response = await axiosInstance.delete(
          `/backend/registeration/delete-registration/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        show(response.data.message, 'success');
        setUpdateTrigger((prev) => !prev);
      } catch (error) {
        show(error.response.data.message, 'error');
      }
    },
    [axiosInstance, show]
  );

  const getParticipantsByDay = useCallback(
    async (userId, token) => {
      try {
        const response = await axiosInstance.get(
          `/backend/registeration/participants-by-day/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(error.response.data.message);
        return null;
      }
    },
    [axiosInstance]
  );

  const deleteSpecificRegistrationAndTeam = useCallback(
    async (id, token) => {
      try {
        const response = await axiosInstance.delete(
          `/backend/registeration/delete-registration/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }
        );
        show(response.data.message);
        setUpdateTrigger((prev) => !prev);
      } catch (error) {
        show(error.response.data.message, 'error');
      }
    },
    [axiosInstance, show]
  );

  const refreshParticipants = useCallback(() => {
    setHasFetched(false);
    setUpdateTrigger((prev) => !prev);
  }, []);

  const contextValues = {
    addParticipant,
    getParticipantsByiD,
    deleteParticipant,
    getRegistrationsByUserId,
    getEventCategoies,
    getEventsByCategory,
    getAmountPayable,
    participants,
    getUpdated: updateTrigger,
    deleteEventByID,
    getRegistrationByID,
    getEventDetails,
    registerTeam,
    getRegisterationInfo,
    generateInvoice,
    loading,
    setLoading,
    updateTrigger,
    getStatistics,
    deleteRegisterations,
    getParticipantsByDay,
    deleteSpecificRegistrationAndTeam,
    refreshParticipants,
  };

  return (
    <RegistrationContext.Provider value={contextValues}>
      {children}
    </RegistrationContext.Provider>
  );
};

const useRegistration = () => useContext(RegistrationContext);

export { RegistrationProvider, useRegistration };
