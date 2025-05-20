// src/services/systemAdmin/passwordConfigurationService.js

import Api from '../Api'; // Adjust the path if your Api.js is located elsewhere

// Fetch the current password configuration
export const fetchPasswordConfiguration = async () => {
  try {
    const response = await Api.get('configuration/getpasswordconfiguration');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};



// Create or Update the password configuration
export const upsertPasswordConfiguration = async (payload) => {
  try {
    const response = await Api.post('configuration/upsertpasswordconfiguration', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};