import React, { createContext, useState } from 'react';

const JobResponsibilityContext = createContext();

const JobResponsibilityProvider = ({ children }) => {
  const [jobResponsibilityId, setJobResponsibilityId] = useState(null);
  const [jobResponsibilityDetails, setJobResponsibilityDetails] = useState(null);

  return (
    <JobResponsibilityContext.Provider 
      value={{ 
        jobResponsibilityId, 
        setJobResponsibilityId, 
        jobResponsibilityDetails, 
        setJobResponsibilityDetails 
      }}
    >
      {children}
    </JobResponsibilityContext.Provider>
  );
};

export { JobResponsibilityProvider, JobResponsibilityContext }; 