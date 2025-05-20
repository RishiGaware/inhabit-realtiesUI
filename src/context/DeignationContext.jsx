import React, { createContext, useState } from 'react';

const DesignationContext = createContext();

const DesignationProvider = ({ children }) => {
  const [selectedDesignation, setSelectedDesignation] = useState({
    designationId: null,
    designationName: ''
  });

  const setDesignationDetails = (id, name) => {
    setSelectedDesignation({
      designationId: id,
      designationName: name
    });
  };

  return (
    <DesignationContext.Provider value={{ selectedDesignation, setDesignationDetails }}>
      {children}
    </DesignationContext.Provider>
  );
};

export { DesignationProvider, DesignationContext };