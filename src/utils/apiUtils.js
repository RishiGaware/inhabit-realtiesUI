import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://82.180.147.10:7002/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is due to authentication (401), redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Authentication
  login: (credentials) => api.post('authentication/login', credentials),
  changePassword: (data) => api.post('authentication/changepassword', data),
  
  // User Management
  getUsers: (params) => api.post('user/getusersbasicinfo', params),
  createUser: (userData) => api.post('user/createuserbasicinfo', userData),
  verifyLoginId: (loginId) => api.get(`user/verify-login/${loginId}`),
  
  // Password Configuration
  getPasswordConfig: () => api.get('configuration/getpasswordconfiguration'),
  updatePasswordConfig: (config) => api.post('configuration/upsertpasswordconfiguration', config),
  
  // Generic methods
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};

export default apiService; 