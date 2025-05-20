// src/services/designationService.js
import Api from '../Api';

// Fetch all designations
export const fetchAllDesignations = async (pageNumber = 1, itemsPerPage = 5, search = '') => {
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const response = await Api.post('designation/get', {
      page: { offset: offset, fetch: itemsPerPage },
      search: search ? { designationName: search } : undefined,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return full API error message
    } else {
      throw error;
    }
  }
};

// Create a new designation
export const createDesignation = async (payload) => {
  try {
    const response = await Api.post('designation/create', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Update designation
export const updateDesignation = async (payload) => {
  try {
    const response = await Api.post('designation/update', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Delete designation
export const deleteDesignation = async (designationID) => {
  const response = await Api.post('designation/delete', { designationID });
  return response.data;
};