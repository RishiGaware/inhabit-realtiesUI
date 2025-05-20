// src/services/PlantMasterService.js
import Api from '../Api';

// Fetch plants with pagination
export const fetchAllPlants = async (pageNumber = 1, itemsPerPage = 10) => {
  const offset = (pageNumber - 1) * itemsPerPage;
  const requestBody = {
    page: { offset: offset, fetch: itemsPerPage }
  };

  try {
    // console.log('Request body:', requestBody);
    const response = await Api.post('plant/get', requestBody);
    // console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // console.error('API error response:', error.response.data); //  log error
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Create a new plant
export const createPlant = async (payload) => {
  try {
    const response = await Api.post('plant/create', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Update an existing plant
export const updatePlant = async (payload) => {
  try {
    const response = await Api.post('plant/update', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Delete a plant with POST /api/plant/delete and X-Plant-Id header
export const deletePlant = async ({ plantID, modifiedBy }) => {
  try {
    const response = await Api.post('plant/delete', 
      { plantID, modifiedBy },
      {
        headers: {
          'X-Plant-Id': plantID.toString(),
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};
