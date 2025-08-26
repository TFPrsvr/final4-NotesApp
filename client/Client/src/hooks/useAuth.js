import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginUser, logoutUser, isAuthenticated } = useUser();

  const login = async (credentials, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/users/loginUser`,
        data: credentials,
        withCredentials: true,
      });

      const { token, userId, username, firstName, lastName } = response.data;

      // Store token in cookie for server requests
      document.cookie = `jwt=${token}; path=/`;
      
      // Store remember me preference
      localStorage.setItem('rememberMe', rememberMe.toString());
      
      // Use user context to manage user state
      loginUser({
        userId,
        username,
        firstName,
        lastName
      }, token);

      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.data?.msg === 'Token has expired, please log in again') {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { 
        withCredentials: true 
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }

    // Use user context to clear user state
    logoutUser();
    
    setLoading(false);
    navigate('/login2');
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