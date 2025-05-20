// src/services/plantAssignService.js
import Api from '../Api'; // assuming you already have a common Api.js

export const fetchAllPlantsAssign = async (pageNumber = 1, itemsPerPage = 5, search = '') => {
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const response = await Api.post('plantassignment/get', {
      page: { offset: offset, fetch: itemsPerPage },
      search: search ? { plantName: search } : undefined,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Fetch plants with pagination
export const fetchAllPlants = async (pageNumber = 1, itemsPerPage = 100) => {
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

// Create a new plant assignment
export const createPlantAssign = async (payload) => {
  try {
    const response = await Api.post('plantassignment/create', payload);
    console.log('Plant Assigned successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error assigning plant:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Update plant assignment
export const updatePlantAssign = async (payload) => {
  try {
    const response = await Api.post('plantassignment/update', payload);
    console.log('Plant assignment updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating plant assignment:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Delete plant assignment
export const deletePlantAssign = async (plantAssignmentID) => {
  try {
    const response = await Api.post('plantassignment/delete', { plantAssignmentID });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};