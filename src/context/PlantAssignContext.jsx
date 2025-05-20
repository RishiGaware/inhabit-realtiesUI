import React, { createContext, useState } from 'react';

const PlantAssignContext = createContext();

const PlantAssignProvider = ({ children }) => {
  const [selectedPlantAssignment, setSelectedPlantAssignment] = useState(() => {
    const saved = sessionStorage.getItem('selectedPlantAssignment');
    return saved ? JSON.parse(saved) : {
      plantAssignmentID: null,
      employeeID: null,
      fullName: '',
      plantIDs: []
    };
  });

  const setPlantAssignDetails = (plantAssignmentID, employeeID, fullName, plantIDs) => {
    const assignment = { plantAssignmentID, employeeID, fullName, plantIDs };
    setSelectedPlantAssignment(assignment);
    sessionStorage.setItem('selectedPlantAssignment', JSON.stringify(assignment));
  };

  return (
    <PlantAssignContext.Provider value={{ selectedPlantAssignment, setPlantAssignDetails }}>
      {children}
    </PlantAssignContext.Provider>
  );
};

export { PlantAssignProvider, PlantAssignContext };