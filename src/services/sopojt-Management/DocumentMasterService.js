// For now, we'll use localStorage to simulate API calls
const DOCUMENTS_STORAGE_KEY = 'documents';

// Get all documents
export const fetchDocuments = async (pageNumber = 1, itemsPerPage = 10, search = '') => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = JSON.parse(localStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
    
    // Apply search filter if provided
    const filteredDocs = search
      ? documents.filter(doc =>
          `${doc.name} ${doc.code} ${doc.type} ${doc.version}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : documents;

    // Apply pagination
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

    return {
      header: { errorCount: 0, messages: [] },
      documents: paginatedDocs,
      totalRecord: filteredDocs.length
    };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return {
      header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Failed to fetch documents' }] },
      documents: [],
      totalRecord: 0
    };
  }
};

// Create a new document
export const createDocument = async (documentData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = JSON.parse(localStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
    const newDocument = {
      id: Date.now(), // Generate a unique ID
      ...documentData,
      createdDate: new Date().toISOString(),
      createdBy: 'Admin' // This would come from the logged-in user in a real app
    };

    documents.push(newDocument);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));

    return {
      header: { errorCount: 0, messages: [{ messageLevel: 'Success', messageText: 'Document created successfully' }] },
      document: newDocument
    };
  } catch (error) {
    console.error('Error creating document:', error);
    return {
      header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Failed to create document' }] }
    };
  }
};

// Update an existing document
export const updateDocument = async (documentData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = JSON.parse(localStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
    const index = documents.findIndex(doc => doc.id === documentData.id);

    if (index === -1) {
      return {
        header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Document not found' }] }
      };
    }

    documents[index] = {
      ...documents[index],
      ...documentData,
      modifiedDate: new Date().toISOString(),
      modifiedBy: 'Admin' // This would come from the logged-in user in a real app
    };

    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));

    return {
      header: { errorCount: 0, messages: [{ messageLevel: 'Success', messageText: 'Document updated successfully' }] },
      document: documents[index]
    };
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Failed to update document' }] }
    };
  }
};

// Delete/Deactivate a document
export const deleteDocument = async (documentId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const documents = JSON.parse(localStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
    const filteredDocs = documents.filter(doc => doc.id !== documentId);

    if (filteredDocs.length === documents.length) {
      return {
        header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Document not found' }] }
      };
    }

    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(filteredDocs));

    return {
      header: { errorCount: 0, messages: [{ messageLevel: 'Success', messageText: 'Document deleted successfully' }] }
    };
  } catch (error) {
    console.error('Error deleting document:', error);
    return {
      header: { errorCount: 1, messages: [{ messageLevel: 'Error', messageText: 'Failed to delete document' }] }
    };
  }
}; 