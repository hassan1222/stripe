// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  // Register a new user
  signup: async (username, email, password, role) => {
    console.log('Sending signup request with role:', role); // Add logging
    const response = await apiClient.post('/signup', {
      username,
      email,
      password,
      role
    });
    
    // Store token in localStorage if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/login', {
      email,
      password
    });
    
    // Store token in localStorage if provided
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  // Get user by token
  getUserByToken: async (token) => {
    const response = await apiClient.get(`/user-by-token?token=${token}`);
    return response.data;
  }
};

export default authService;