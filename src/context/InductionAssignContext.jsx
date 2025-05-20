// src/context/InductionAssignContext.jsx
import React, { createContext, useState } from 'react';

const InductionAssignContext = createContext();

const InductionAssignProvider = ({ children }) => {
  const [selectedInduction, setSelectedInduction] = useState({
    inductionID: null,
    userID: '',
    firstName: '',
    lastName: '',
    dueDate: '',
    remarks: '',
    inductionStatus: '',
    reasonForChange: ''
  });

  const setInductionDetails = (data) => {
    setSelectedInduction(data);
  };

  return (
    <InductionAssignContext.Provider value={{ selectedInduction, setInductionDetails }}>
      {children}
    </InductionAssignContext.Provider>
  );
};

export { InductionAssignProvider, InductionAssignContext };
