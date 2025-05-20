import Api from '../Api';

export const forgotPassword = async (loginId) => {
  try {
    const response = await Api.post('authentication/forgotpassword', {
      loginId
    }, {
      headers: {
        'X-Plant-Id': sessionStorage.getItem('plantId') || '1',
        'Content-Type': 'application/json',
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