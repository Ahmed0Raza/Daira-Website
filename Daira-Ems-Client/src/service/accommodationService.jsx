import { createContext, useContext } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const AccommodationContext = createContext();

const AccommodationProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();

  const getApprovedAccommodationDetails = async (token) => {
    const response = await axiosInstance.get(
      '/backend/accommodations/confirm-accommodations',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  };
  
  const getUnapprovedAccommodationDetails = async (token) => {
    const response = await axiosInstance.get(
      '/backend/accommodations/unconfirm-accommodations',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  };
  
  const getAccommodationDetails = async (token) => {
    try {
      const approved = await getApprovedAccommodationDetails(token);
      const unapproved = await getUnapprovedAccommodationDetails(token);
  
      return {
        approved,
        unapproved,
      };
    } catch (error) {
      console.error('Error fetching accommodation details:', error);
      show('Error fetching accommodation details', 'error');
      throw error;
    }
  };
  

 
  const contextValues = {
    getAccommodationDetails,
  };

  return (
    <AccommodationContext.Provider value={contextValues}>
      {children}
    </AccommodationContext.Provider>
  );
};

const useAccommodation = () => useContext(AccommodationContext);

export { AccommodationProvider, useAccommodation };