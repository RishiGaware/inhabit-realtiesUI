// src/services/roleService.js
import Api from '../Api';

// Fetch all roles
export const fetchAllRoles = async () => {
  try {
    const response = await Api.post('role/get', {
      page: { offset: 0, fetch: 100 }
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

// Create a new role
export const createRole = async (payload) => {
  try {
    const response = await Api.post('role/create', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Update an existing role
export const updateRole = async (payload) => {
  try {
    const response = await Api.post('role/update', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const deleteRole = async (roleID) => {
  try {
    const response = await Api.post('role/delete', { roleID });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};