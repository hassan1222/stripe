// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have a token in local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      authService.getUserByToken(token)
        .then(userData => {
          setCurrentUser(userData);
        })
        .catch(err => {
          // If token is invalid, clear it
          console.error('Token validation error:', err);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (username, email, password) => {
    setError(null);
    try {
      const userData = await authService.signup(username, email, password);
      localStorage.setItem('token', userData.token);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const userData = await authService.login(email, password);
      localStorage.setItem('token', userData.token);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Set auth token and fetch user data (for Google auth)
  const setAuthToken = async (token) => {
    setError(null);
    try {
      const userData = await authService.getUserByToken(token);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    setAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};