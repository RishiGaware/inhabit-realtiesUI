import Api from './Api';

export const fetchPlantAssignmentsByUserId = async (userId) => {
  const token = sessionStorage.getItem('authToken');
  const plantId = sessionStorage.getItem('plantId');
  if (!token || !plantId) throw new Error('Missing auth or plantId');
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
}; 