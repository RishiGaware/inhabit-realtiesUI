import Api from '../Api';

export const changePassword = async ({ password }) => {
  const payload = {
    userId: 0, // default value as per API
    password,
  };

  try {
    const response = await Api.post('authentication/changepassword', payload, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        data: error.response.data,
      };
    } else {
      throw error;
    }
  }
};