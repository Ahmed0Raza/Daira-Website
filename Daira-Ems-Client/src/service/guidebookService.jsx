import React, { createContext, useContext } from 'react';
import CreateAxiosInstance from '../utils/axiosInstance';
import { useSnackbar } from '../utils/snackbarContextProvider';

const guidebookContext = createContext();

const GuidebookProvider = ({ children }) => {
  const { show } = useSnackbar();
  const axiosInstance = CreateAxiosInstance();

  const uploadGuidebook = async (data, token) => {
    let response = false;
    await axiosInstance
      .post(`/backend/admin/updateGuideBook`, data, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        response = res.data;
        show('Guidebook uploaded successfully', 'success');
      })
      .catch((error) => {
        show(error.message, 'error');
      });
    return response;
  };

  const getGuidebook = async () => {
    try {
      const response = await axiosInstance.get('/backend/public/get-guidebook');
      const { data } = response;
      const { pdfFile: bufferObj } = data;
      const blob = new Blob([new Uint8Array(bufferObj.data)], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      return { blob, url };
    } catch (error) {
      show(error.message, 'error');
    }
  };

  const contextValues = {
    uploadGuidebook,
    getGuidebook,
  };

  return (
    <guidebookContext.Provider value={contextValues}>
      {children}
    </guidebookContext.Provider>
  );
};

const useGuidebook = () => useContext(guidebookContext);

export { GuidebookProvider, useGuidebook };
