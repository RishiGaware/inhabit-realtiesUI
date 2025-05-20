// src/context/RoleAssignmentContext.jsx
import React, { createContext, useState, useContext } from 'react';

const RoleAssignmentContext = createContext();

const RoleAssignmentProvider = ({ children }) => {
  const [selectedRoleAssignment, setSelectedRoleAssignment] = useState({
    roleID: '',
    userId: '',
    reasonForChange: '',
    plantID: '',
    electronicSignature: '',
  });

  return (
    <RoleAssignmentContext.Provider value={{ selectedRoleAssignment, setSelectedRoleAssignment }}>
      {children}
    </RoleAssignmentContext.Provider>
  );
};

export { RoleAssignmentProvider, RoleAssignmentContext };
