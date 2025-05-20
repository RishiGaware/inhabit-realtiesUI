import Api from '../Api';

// Fetch all pending documents for review and approval
export const fetchPendingDocuments = async () => {
  try {
    const response = await Api.get('document/getallpendingapproval');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return full API error message
    } else {
      throw error;
    }
  }
};

// Approve document
export const approveDocument = async (documentId, remarks) => {
  try {
    const response = await Api.post('document/approve', {
      documentID: documentId,
      approvalRemarks: remarks
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

// Reject document
export const rejectDocument = async (documentId, remarks) => {
  try {
    const response = await Api.post('document/reject', {
      documentID: documentId,
      rejectionRemarks: remarks
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

// Return document to initiator
export const returnDocument = async (documentId, remarks) => {
  try {
    const response = await Api.post('document/return', {
      documentID: documentId,
      returnRemarks: remarks
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

// Update document status (e.g., Return, Approve, Reject)
export const updateDocumentStatus = async (requestBody) => {
  try {
    const response = await Api.post('document/updatestatus', requestBody);
    console.log(response)
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};


// Download document by ID
export const downloadDocumentById = async (documentId) => {
  try {
    const response = await Api.get(`document/download/${documentId}`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};