// src/services/departmentService.js
import Api from '../Api';

// Fetch departments with pagination
export const fetchAllDepartments = async (pageNumber = 1, itemsPerPage = 5) => {
  const offset = (pageNumber - 1) * itemsPerPage;
  
  try {
    const response = await Api.post('department/get', {
      page: { offset: offset, fetch: itemsPerPage }
    });

    return response.data; // Return response data
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error; // rethrow if no structured error
    }
  }
};


// Create a new department
export const createDepartment = async (payload) => {
  try {
    const response = await Api.post('department/create', payload);
    return response.data;
  } catch (error) {
    // Return error response to calling function
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error; // rethrow if no structured error
    }
  }
};

// Update department
export const updateDepartment = async (payload) => {
  try {
    const response = await Api.post('department/update', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Delete department
export const deleteDepartment = async (departmentID) => {
  const response = await Api.post('department/delete', { departmentID });
  return response.data;
};

