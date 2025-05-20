// PlantContext.jsx
import React, { createContext, useState } from 'react';

const PlantContext = createContext();

const PlantProvider = ({ children }) => {
  const [selectedPlant, setSelectedPlant] = useState({
    plantID: null,
    plantName: '',
  });

  const setPlantDetails = (id, name) => {
    setSelectedPlant({
      plantID: id,
      plantName: name,
    });
  };

  return (
    <PlantContext.Provider value={{ selectedPlant, setPlantDetails }}>
      {children}
    </PlantContext.Provider>
  );
};

export { PlantProvider, PlantContext };
