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

const DEFAULT_PREFERENCES = {
  defaultNoteColor: '#ffd54f',
  font: 'Arial',
  layout: 'grid'
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    axios({
      method: 'get',
      url: `${import.meta.env.VITE_API_URL}/api/getUser`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
          if (response.data.preferences) {
            setPreferences(response.data.preferences);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      });
  };

  const loginUser = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);

    if (userData.preferences) {
      setPreferences(userData.preferences);
    }

    localStorage.setItem('userToken', token);
    localStorage.setItem('userId', userData._id || userData.userId);
    localStorage.setItem('userData', JSON.stringify({
      username: userData.username,
      first: userData.first,
      last: userData.last,
      _id: userData._id || userData.userId
    }));
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPreferences(DEFAULT_PREFERENCES);

    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));

    const currentData = JSON.parse(localStorage.getItem('userData') || '{}');
    localStorage.setItem('userData', JSON.stringify({ ...currentData, ...updatedUserData }));
  };

  const updatePreferences = (newPrefs) => {
    const token = localStorage.getItem('userToken');

    return axios({
      method: 'put',
      url: `${import.meta.env.VITE_API_URL}/api/users/preferences`,
      data: newPrefs,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data && response.data.user && response.data.user.preferences) {
          setPreferences(response.data.user.preferences);
          setUser(prev => ({ ...prev, preferences: response.data.user.preferences }));
        }
        return response;
      })
      .catch(err => {
        console.error('Error updating preferences:', err.message);
        throw err;
      });
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    preferences,
    loginUser,
    logoutUser,
    updateUser,
    updatePreferences,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
