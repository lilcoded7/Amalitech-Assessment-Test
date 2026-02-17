import axios from 'axios';

// Create the base instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Base URL to cover both v1 and v2
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Attach the token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vault_token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for logout or redirecting to login page
      console.error("Session expired. Please log in again.");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vault_token');
        window.location.href = '/accounts/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;