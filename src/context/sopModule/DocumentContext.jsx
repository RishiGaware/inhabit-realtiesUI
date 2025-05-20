import React, { createContext, useState } from 'react';

const DocumentContext = createContext();

const DocumentProvider = ({ children }) => {
  const [documentId, setDocumentId] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);

  return (
    <DocumentContext.Provider value={{ documentId, setDocumentId, documentDetails, setDocumentDetails }}>
      {children}
    </DocumentContext.Provider>
  );
};

export { DocumentProvider, DocumentContext }; 