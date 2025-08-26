import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check for stored token
      const token = localStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with server and get user data
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getUser`,
        { 
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('userToken', token);
    localStorage.setItem('userId', userData.userId || userData._id);
    
    // Store user data for quick access
    localStorage.setItem('userData', JSON.stringify({
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      userId: userData.userId || userData._id
    }));
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear all stored data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // Update stored user data
    const currentData = JSON.parse(localStorage.getItem('userData') || '{}');
    localStorage.setItem('userData', JSON.stringify({
      ...currentData,
      ...updatedUserData
    }));
  };

  // Auto-login from stored data if available and user wants to be remembered
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storedUserData = localStorage.getItem('userData');
    const token = localStorage.getItem('userToken');
    
    if (rememberMe && storedUserData && token && !user) {
      try {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        logoutUser();
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    loginUser,
    logoutUser,
    updateUser,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};