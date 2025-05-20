// RoleContext.js
import React, { createContext, useState } from 'react';

const RoleContext = createContext();

const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState({
    roleID: null,
    roleName: '',
    description: '',
    reasonForChange: ''
  });

  const setRoleDetails = (id, name, description = '', reasonForChange = '') => {
    setSelectedRole({
      roleID: id,
      roleName: name,
      description,
      reasonForChange
    });
  };

  return (
    <RoleContext.Provider value={{ selectedRole, setRoleDetails }}>
      {children}
    </RoleContext.Provider>
  );
};

export { RoleProvider, RoleContext };
