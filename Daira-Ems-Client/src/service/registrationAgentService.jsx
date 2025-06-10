'use client';

import { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const RegistationAgentContext = createContext();

const RegistrationAgentProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  const getUserInvoiceData = async (token, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/backend/agent/getUserDataByEmail`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        }
      );
      setInvoiceData(response.data);
      //show('Success');
      return response.data;
    } catch (error) {
      console.log(error);
      show(
        error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch invoice data (Try Reloading)',
        'error',
        'error'
      );
      setLoading(false);
    }
    setLoading(false);
  };
  const getUserInvoices = async (token, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getuserinvoices`,
        {
          params: data,
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
        }
      );
      setInvoiceData(response.data);
      //show('Success');
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      show(
        error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch invoice data (Try Reloading)',
        'error'
      );
      setLoading(false);
    }
    setLoading(false);
  };
  const createUser = async (token, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/backend/admin/create-registration-agent`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const approveRegistration = async (token, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/backend/agent/approveRegistration`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Registration Approved', 'success');
      return true;
    } catch (error) {
      //show('Registration Unsuccessfull', 'error');

      setLoading(false);
      return false;
    }
  };

  const getRegistrationAgentStats = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getAgentDashboardStats`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched registration stats successfully', 'success');
      return response.data;
    } catch (error) {
      console.log(error);
      show(
        error?.response?.data?.message || 'Failed to fetch registration stats',
        'error'
      );
      setLoading(false);
      return null;
    }
  };

  const getApprovedTeamPaymentInfo = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getApprovedTeamPaymentInfo`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched approved Payment info successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message || 'Failed to fetch approved team info',
        'error'
      );
      setLoading(false);
      return null;
    }
  };
  const getApprovedTeamInfo = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getApprovedTeamInfo`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched approved team info successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message || 'Failed to fetch approved team info',
        'error'
      );
      setLoading(false);
      return null;
    }
  };
  const getUnapprovedTeamInfo = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getUnapprovedTeamInfo`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched approved team info successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message || 'Failed to fetch approved team info',
        'error'
      );
      setLoading(false);
      return null;
    }
  };
  const getApprovedAccommodationDetails = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getapprovedAccommodationDetails`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched approved accommodation details successfully', 'success');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message ||
          'Failed to fetch approved accommodation details',
        'error'
      );
      setLoading(false);
      return null;
    }
  };
  const getUnapprovedAccommodationDetails = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getunapprovedAccommodationDetails`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched unapproved accommodation details successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message ||
          'Failed to fetch unapproved accommodation details',
        'error'
      );
      setLoading(false);
      return null;
    }
  };
  const getApprovedParticipantDetails = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getapprovedparticipantdetails`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      console.log(response)
      setLoading(false);
      //show('Fetched approved participant details successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message ||
          'Failed to fetch approved participant details',
        'error'
      );
      setLoading(false);
      return null;
    }
  };

  const getRegisteredUsers = async (token) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/backend/agent/getregisteredusers`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Fetched registered users successfully', 'success');
      return response.data;
    } catch (error) {
      console.error(error);
      show(
        error?.response?.data?.message || 'Failed to fetch registered users',
        'error'
      );
      setLoading(false);
      return null;
    }
  };

  const createRegistrationInvoice = async (token, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/backend/agent/createRegistrationInvoice`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Invoice Created Successfully', 'success');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      //show('Invoice Is Not Generated', 'error');
      setLoading(false);
      return { invoice: '', invoiceId: '' };
    }
  };
  const createInvoiceCards = async (token, invoiceIds, type) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/backend/agent/createInvoiceCards`,
        {
          invoiceIds,
          type,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      //show('Invoice Created Successfully', 'success');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      //show('Invoice Is Not Generated', 'error');
      setLoading(false);
      return { invoice: '', invoiceId: '' };
    }
  };

  const getAmbassadorParticipants = async (token, email) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        '/backend/agent/get-all-partcipants',
        {
          params: { useremail: email },
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log(error);
      show(
        error.response?.data?.message ||
          'Failed to fetch ambassador participants',
        'error'
      );
      setLoading(false);
      return { participants: [] };
    }
  };

  const updateParticipant = async (token, participantId, updatedData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/backend/agent/edit-ambassador-participant/${participantId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      show('Participant updated successfully', 'success');
      return response.data;
    } catch (error) {
      console.error('Error updating participant:', error);
      show(
        error.response?.data?.message || 'Failed to update participant',
        'error'
      );
      setLoading(false);
      return null;
    }
  };

  const deleteParticipant = async (token, participantId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/backend/agent/delete-ambassador-participant/${participantId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }
      );
      setLoading(false);
      show('Participant deleted successfully', 'success');
      return response.data;
    } catch (error) {
      console.error('Error deleting participant:', error);
      show(
        error.response?.data?.message || 'Failed to delete participant',
        'error'
      );
      setLoading(false);
      return null;
    }
  };

  const contextValues = {
    getUserInvoiceData,
    loading,
    invoiceData,
    setLoading,
    createUser,
    approveRegistration,
    createRegistrationInvoice,
    getUserInvoices,
    createInvoiceCards,
    getRegistrationAgentStats,
    getApprovedTeamInfo,
    getUnapprovedTeamInfo,
    getUnapprovedAccommodationDetails,
    getApprovedAccommodationDetails,
    getRegisteredUsers,
    getApprovedParticipantDetails,
    getApprovedTeamPaymentInfo,
    getAmbassadorParticipants,
    updateParticipant,
    deleteParticipant,
  };

  return (
    <RegistationAgentContext.Provider value={contextValues}>
      {children}
    </RegistationAgentContext.Provider>
  );
};

const useRegistrationAgent = () => useContext(RegistationAgentContext);

export { RegistrationAgentProvider, useRegistrationAgent };
