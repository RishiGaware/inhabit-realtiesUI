// src/services/userPersonalDetailsService.js
import Api from '../Api';

// Fetch all user personal details with pagination
export const fetchAllUserPersonalDetails = async (pageNumber = 1, itemsPerPage = 5, search = '') => {
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');

    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }
    
    const payload = {
      page: { offset: offset, fetch: itemsPerPage },
      search: search ? {
        firstName: search,
        lastName: search,
        address: search,
        contactNo: search
      } : undefined
    };

    const response = await Api.post('/user/getuserspersonainfo', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Plant-Id': plantId,
        'Content-Type': 'application/json'
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

// Create a new user personal detail
export const createUserPersonalDetail = async (payload) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');

    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }

    const response = await Api.post('/user/createuserpersonalinfo', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Plant-Id': plantId,
        'Content-Type': 'application/json'
      }
    });
    
      return response.data;
  } catch (error) {
    console.error('Error creating user personal details:', error);
    throw error;
  }
};

// Update an existing user personal detail
export const updateUserPersonalDetail = async (payload) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');

    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }

    const response = await Api.post('/user/updateuserpersonalinfo', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Plant-Id': plantId,
        'Content-Type': 'application/json'
      }
    });
    
      return response.data;
  } catch (error) {
    console.error('Error updating user personal details:', error);
    throw error;
  }
};

// Optional: Delete a user personal detail (if needed)
// export const deleteUserPersonalDetail = async (id) => {
//   const response = await Api.delete(`user/delete/${id}`);
//   return response.data;
// };