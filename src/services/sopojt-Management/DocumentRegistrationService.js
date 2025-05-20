import Api from '../Api';

// Fetch list of document types
export const fetchDocumentTypes = async () => {
  try {
    const response = await Api.get('lookup/documenttype');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return API-provided error
    } else {
      throw error;
    }
  }
};

// Create a new document
export const createDocument = async (formDataToSend) => {
  try {
    const response = await Api.post('document/create', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return API-provided error
    } else {
      throw error;
    }
  }
};

// Fetch documents by user ID
export const fetchDocumentsByUserId = async (pageNumber = 1, itemsPerPage = 10, search = '') => {
  try {
    const userId = sessionStorage.getItem('userId');
    const offset = (pageNumber - 1) * itemsPerPage;
    console.log(userId)

    const response = await Api.post('document/getbyuserid', {
      userID: userId,
      page: { offset, fetch: itemsPerPage },
      search: search ? { documentName: search } : undefined
    });
    console.log(response)
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response)
      return error.response.data;
    } else {
      throw error;
    }
  }
};



// Delete a document by documentID
export const deleteDocument = async (documentID, modifiedBy) => {
  try {
    const response = await Api.post('document/delete', {
      documentID,
      modifiedBy,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return API error response
    } else {
      throw error;
    }
  }
};