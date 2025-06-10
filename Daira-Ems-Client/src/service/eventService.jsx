import { createContext, useContext } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();

  const uploadEvent = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosInstance.post(
        `/backend/admin/upload-event`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        }
      );
      show('Events uploaded successfully', 'success');
      return response.data;
    } catch (error) {
      show('Error uploading events', 'error');
      throw error;
    }
  };

  const getEvents = async () => {
    try {
      const response = await axiosInstance.get(`/backend/admin/get-events`);
      if (response.status !== 200) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return null;
    }
  };

  const getEventById = async (id) => {
    try {
      const response = await axiosInstance.get(
        `/backend/admin/get-event/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching event', error);
      throw error;
    }
  };

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get(`/backend/admin/get-categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const getEventsByCategory = async (category) => {
    try {
      const response = await axiosInstance.get(
        `/backend/admin/categories/${category}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw error;
    }
  };

  const contextValues = {
    uploadEvent,
    getEvents,
    getEventById,
    getCategory,
    getEventsByCategory,
  };

  return (
    <EventContext.Provider value={contextValues}>
      {children}
    </EventContext.Provider>
  );
};

const useEvent = () => useContext(EventContext);

export { EventProvider, useEvent };
