import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginUser, logoutUser, isAuthenticated } = useUser();

  const login = (credentials, rememberMe = false) => {
    setLoading(true);
    setError(null);

    return axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/api/users/loginUser`,
      data: credentials,
      withCredentials: true
    })
      .then(response => {
        const { token, user } = response.data;

        document.cookie = `jwt=${token}; path=/`;
        localStorage.setItem('rememberMe', rememberMe.toString());

        loginUser(user, token);

        setLoading(false);
        return { success: true, data: response.data };
      })
      .catch(err => {
        setLoading(false);

        let errorMessage = 'Login failed. Please try again.';

        if (err.response?.data?.msg === 'Token has expired, please log in again') {
          errorMessage = 'Session expired. Please log in again.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else if (err.response?.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        setError(errorMessage);
        return { success: false, error: errorMessage };
      });
  };

  const logout = () => {
    setLoading(true);

    axios({
      method: 'get',
      url: `${import.meta.env.VITE_API_URL}/api/users/logout`,
      withCredentials: true
    })
      .then(() => {
        logoutUser();
        setLoading(false);
        navigate('/login2');
      })
      .catch(() => {
        logoutUser();
        setLoading(false);
        navigate('/login2');
      });
  };

  const checkAuthenticated = () => {
    return isAuthenticated;
  };

  return {
    login,
    logout,
    isAuthenticated: checkAuthenticated,
    loading,
    error,
    setError
  };
};
