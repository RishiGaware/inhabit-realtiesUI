// src/api/designationAPI.js
import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://82.180.147.10:7002/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
Api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    if(plantId){
      // config.headers['X-Plant-Id'] = plantId;
      config.headers.set("X-Plant-Id",plantId);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized errors
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('plantId');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default Api;