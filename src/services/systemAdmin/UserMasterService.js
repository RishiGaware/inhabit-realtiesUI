import Api from '../Api'; // Adjust the path if needed

// Fetch users' basic information
export const fetchUsersBasicInfo = async (pageNumber = 1, itemsPerPage = 10, search = '') => {
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const response = await Api.post('/user/getusersbasicinfo', {
      page: { offset: offset, fetch: itemsPerPage },
      search: search ? { userName: search } : undefined, // Replace `userName` with actual searchable field
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

// Create a new user
export async function createUserBasicInfo(userData) {
  try {

    const response = await Api.post('/user/createuserbasicinfo', userData, {

    });

    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update user basic information
export const updateUserBasicInfo = async (updatedUserData) => {
  try {
    const response = await Api.post('user/updateusersbasicinfo', updatedUserData);

    // Log the response for debugging
    console.log('API Response:', response);

    // Check if the response has an error count
    if (response.data?.header?.errorCount > 0) {
      const errorMessages = response.data.header.messages
        .filter(msg => msg.messageLevel === 'Error')
        .map(msg => msg.messageText)
        .join('\n');
      throw new Error(errorMessages || 'Failed to update user');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    // If the error has a response with error messages, use those
    if (error.response?.data?.header?.messages) {
      const errorMessages = error.response.data.header.messages
        .filter(msg => msg.messageLevel === 'Error')
        .map(msg => msg.messageText)
        .join('\n');
      throw new Error(errorMessages);
    }
    // If no specific error message is available, throw the original error
    throw error;
  }
};

export const deleteUser = async (userID) => {
  try {
    const response = await Api.post('/user/deleteuser', {
      userID: userID,
      modifiedBy: sessionStorage.getItem('userId') || 'Admin'
    });

    // Check if the response has an error count
    if (response.data?.header?.errorCount > 0) {
      const errorMessages = response.data.header.messages
        .filter(msg => msg.messageLevel === 'Error')
        .map(msg => msg.messageText)
        .join('\n');
      throw new Error(errorMessages || 'Failed to delete user');
    }

    return response.data;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    // If the error has a response with error messages, use those
    if (error.response?.data?.header?.messages) {
      const errorMessages = error.response.data.header.messages
        .filter(msg => msg.messageLevel === 'Error')
        .map(msg => msg.messageText)
        .join('\n');
      throw new Error(errorMessages);
    }
    throw error;
  }
}