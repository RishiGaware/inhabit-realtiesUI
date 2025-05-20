import Api from '../Api';

export const fetchAllInductionAssignments = async (pageNumber = 1, itemsPerPage = 5) => {
    const offset = (pageNumber - 1) * itemsPerPage;
  
    try {
      const response = await Api.post('inductionassignment/get', {
        page: { offset: offset, fetch: itemsPerPage }
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

export const assignInduction = async (payload) => {
    try {
        const response = await Api.post('inductionassignment/create', payload);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw error; // rethrow if no structured error
        }
    }
}

export const fetchUnassignedUsers = async () => {
    try {
        const response = await Api.get('inductionassignment/getinductionnotassignedusers', {});
        return response.data.users || []; // Extract the users array
    } catch (error) {
        console.error("Error fetching unassigned users:", error);
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw error; 
        }
    }
};


export const updateInductionAssignment = async (payload) => {
    try {
        const response = await Api.post('inductionassignment/update', payload);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw error; 
        }
    }
}

export const getInductionAssignmentById = async (inductionAssignmentId) => {
    try {
      const response = await Api.get(`/inductionassignment/${inductionAssignmentId}`);
      return response.data.inductionAssignment; // Return the inductionAssignment object directly
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  };

