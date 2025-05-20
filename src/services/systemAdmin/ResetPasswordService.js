import Api from '../Api';

export const resetPassword = async ({ loginId, email, password, token, userId = 0 }) => {
  try {
    const response = await Api.post('authentication/resetpassword', {
      loginId,
      email,
      password,
      token,
      userId
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