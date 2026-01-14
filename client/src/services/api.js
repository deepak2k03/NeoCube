import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Check for "Skip Redirect" flag
    // If the request config has _skipAuthRedirect: true, we do NOT auto-redirect.
    if (error.config && error.config._skipAuthRedirect) {
      return Promise.reject(error);
    }

    // 2. Handle 401 Unauthorized (Global Auto-Logout)
    if (error.response?.status === 401) {
      console.warn('Session expired. Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we aren't already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 3. Format Error Message
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'An unexpected error occurred';
    
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;