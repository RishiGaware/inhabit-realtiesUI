import Api from '../Api'; // Adjust the path if needed

// Fetch password reset requests
export const fetchPasswordResetRequests = async () => {
  const response = await Api.post('password/getresetrequest', {
    page: { offset: 0, fetch: 100 },
  });
  return response.data;
};

// Accept password reset and change password
export const acceptPasswordReset = async (transactionID, password, acceptedBy, plantID) => {
  const payload = {
    transactionId: transactionID,
    password,
    acceptedBy,
    plantID,
  };

  const response = await Api.post('password/acceptreset', payload);
  return response.data;
};