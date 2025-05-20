import Api from '../Api';

export const fetchUserBasicInfoById = async (userId) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');
    console.log('fetchUserBasicInfoById:', { userId, token, plantId });
    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }
    const response = await Api.get(
      `/user/getuserbasicinfobyuserid/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Plant-Id': plantId,
          'accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user basic info by ID:', error);
    throw error;
  }
};

export const fetchUserPersonalInfoById = async (userId) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');
    console.log('fetchUserPersonalInfoById:', { userId, token, plantId });
    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }
    const response = await Api.get(
      `/user/getuserpersonainfobyuserid/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Plant-Id': plantId,
          'accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user personal info by ID:', error);
    throw error;
  }
};

export const fetchPlantAssignmentsByUserId = async (userId) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');
    console.log('fetchPlantAssignmentsByUserId:', { userId, token, plantId });
    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }
    const response = await Api.get(
      `/plantassignment/getplantassignmentsbyuserid/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Plant-Id': plantId,
          'accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching plant assignments by user ID:', error);
    throw error;
  }
};

export const fetchRoleAssignmentByUserId = async (userId) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const plantId = sessionStorage.getItem('plantId');
    console.log('fetchRoleAssignmentByUserId:', { userId, token, plantId });
    if (!token || !plantId) {
      throw new Error('Authentication token or Plant ID not found');
    }
    const response = await Api.get(
      `/roleassignment/getroleassignmentbyuserid/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Plant-Id': plantId,
          'accept': '*/*',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching role assignment by user ID:', error);
    throw error;
  }
}; 