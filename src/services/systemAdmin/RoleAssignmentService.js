import Api from '../Api'; // Ensure Api.js is correctly configured

const AUTH_HEADER = () => {
  const token = sessionStorage.getItem('authToken');
  const plantId = sessionStorage.getItem('plantId') || '001'; // Default to '001' if not set

  if (!token) {
    console.error('Authorization token is missing');
    throw new Error('Authorization token is missing');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Plant-Id': plantId
  };
};

// Get paginated role assignments
export const getRoleAssignments = async () => {
  try {
    const response = await Api.post(
      'roleassignment/get',
      {
        page: { offset: 0, fetch: 100 },
        signatureDate: new Date().toISOString(),
        electronicSignature: "SYSTEM",
        reasonForChange: "Fetching role assignments"
      },
      { headers: AUTH_HEADER() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Get all roles for dropdown
export const getAllRoles = async () => {
  try {
    const response = await Api.post(
      'role/get',
      { 
        page: { offset: 0, fetch: 100 },
        signatureDate: new Date().toISOString(),
        electronicSignature: "SYSTEM",
        reasonForChange: "Fetching roles"
      },
      { headers: AUTH_HEADER() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

// Get all users for dropdown
export const getAllUsersBasicInfo = async () => {
  try {
    const response = await Api.post(
      'user/getusersbasicinfo',
      { 
        page: { offset: 0, fetch: 100 },
        signatureDate: new Date().toISOString(),
        electronicSignature: "SYSTEM",
        reasonForChange: "Fetching users"
      },
      { headers: AUTH_HEADER() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
    throw error;
    }
  }
};

// Create new role assignment
export const addRoleAssignment = async (payload) => {
  try {
    const enrichedPayload = {
      ...payload,
      signatureDate: new Date().toISOString(),
      electronicSignature: payload.electronicSignature || "SYSTEM",
      reasonForChange: payload.reasonForChange || "Creating role assignment"
    };

    const response = await Api.post('roleassignment/create', enrichedPayload, {
      headers: AUTH_HEADER(),
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

// Get details for one assignment by ID
export const getRoleAssignmentById = async (id) => {
  try {
    const response = await Api.post('roleassignment/getbyid', {
      roleAssignmentID: id,
      signatureDate: new Date().toISOString(),
      electronicSignature: "SYSTEM",
      reasonForChange: "Fetching role assignment details"
    }, {
      headers: AUTH_HEADER(),
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

// Update role assignment
export const updateRoleAssignment = async (payload) => {
  try {
    const response = await Api.post('roleassignment/update', payload, {
      headers: AUTH_HEADER(),
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
