// src/services/JobResposibilityService.js
import Api from '../Api';

  
  // Fetch job responsibilities with pagination using API
  export const fetchAllJobResponsibilities = async (pageNumber = 1, itemsPerPage = 5) => {
    const offset = (pageNumber - 1) * itemsPerPage;
    
    try {
      const response = await Api.post('jobresponsibility/get', {
        page: { offset: offset, fetch: itemsPerPage }
      });
    
      return response.data; // Return response data containing jobResponsibilities array and totalRecord
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        throw error; // rethrow if no structured error
      }
    }
  };
  
  // Create a new job responsibility
  export const createJobResponsibility = async (payload) => {
    try {
      const response = await Api.post('jobresponsibility/create', payload);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  };
  
  // Update job responsibility
  export const updateJobResponsibility = async (payload) => {
    try {
      const response = await Api.post('jobresponsibility/update', payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  };
  
  // Delete job responsibility
  export const deleteJobResponsibility = async (jobResponsibilityID) => {
    try {
      const response = await Api.post('jobresponsibility/delete', { jobResponsibilityID });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  };
  
  // Fetch users not assigned job responsibilities
  export const fetchUsersNotAssignedJobResponsibility = async () => {
    try {
      const response = await Api.get('jobresponsibility/getjobresponsibilitynotassignedusers', {
        headers: {
          'X-Plant-Id': '1',
          'accept': '*/*'
        }
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