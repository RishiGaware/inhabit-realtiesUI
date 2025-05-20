import React, { createContext, useState } from 'react';

const DepartmentContext = createContext();

const DepartmentProvider = ({ children }) => {
  const [selectedDepartment, setSelectedDepartment] = useState({
    departmentId: null,
    departmentName: ''
  });

  const setDepartmentDetails = (id, name) => {
    setSelectedDepartment({
      departmentId: id,
      departmentName: name
    });
  };

  return (
    <DepartmentContext.Provider value={{ selectedDepartment, setDepartmentDetails }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export { DepartmentProvider, DepartmentContext };