import axios from 'axios';

const API_URL = 'http://82.180.147.10:7002/api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/authentication/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/authentication/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (loginId) => {
    try {
      const response = await axios.post(`${API_URL}/password/reset`, { loginId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 