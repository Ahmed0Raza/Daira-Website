import { createContext, useContext, useState } from 'react';
import CreateAxiosInstance from '../../../utils/axiosInstance';
import { useSnackbar } from '../../../utils/snackbarContextProvider';

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();
  const [user, setUser] = useState(false);
  const axiosInstance = CreateAxiosInstance();

  const signup = async (data) => {
    setLoading(true);
    console.log("reached service")
    const response = await axiosInstance
      .post('/backend/auth/signup', data)
      .then((response) => {
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        show(error.response.data.message, 'error');
        return false;
      });
    return response;
  };

  const login = async (data) => {
    let valid = true;
    setLoading(true);
    await axiosInstance
      .post('/backend/auth/login', data)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setLoading(false);
          show('Invalid credentials', 'error');
          valid = false;
        }

        show('Logged in successfully', 'success');
        const data = JSON.stringify(response);
        localStorage.setItem('userData', data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        show(error.response.data.message, 'error');
        valid = false;
      });
    return valid;
  };

  const forgotPassword = async (email, password, captchaValue) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/backend/auth/forgetpass', {
        email,
        password,
        captchaValue,
      });
      setLoading(false);

      if (response.status !== 200) {
        throw new Error(
          response.data.message ||
            'An error occurred during the password reset process.'
        );
      }

      show(response.data.message, 'success');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const verifyOTP = async (otp, captchaValue) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/backend/auth/verifyotp', {
        otp,
        captchaValue,
      });
      setLoading(false);
      show(response.data.message, 'success');
    } catch (error) {
      setLoading(false);
      show(error.response.data.message, 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUser(false);
    show('Logged out successfully', 'success');
  };

  const contextValues = {
    signup,
    loading,
    login,
    logout,
    user,
    setUser,
    setLoading,
    forgotPassword,
    verifyOTP,
  };

  return (
    <UserAuthContext.Provider value={contextValues}>
      {children}
    </UserAuthContext.Provider>
  );
};

const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export { UserAuthProvider, useUserAuth };
