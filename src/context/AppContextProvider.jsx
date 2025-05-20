import React from 'react';
import { DesignationProvider } from './DeignationContext';
import { UserProvider } from './UserContext';
import { DepartmentProvider } from './DepartmentContext';
import { UserPersonalProvider } from './UserPersonalContext';
import { RoleProvider } from './RoleContext';
import { PlantProvider } from './PlantContext';
import { PlantAssignProvider } from './PlantAssignContext';
import { RoleAssignmentProvider } from './RoleAssignmentContext';
import { InductionAssignProvider } from './InductionAssignContext';
import { JobResponsibilityProvider } from './induction/JobResponsibilityContext';
import { DocumentProvider } from './sopModule/DocumentContext';

// import { JobProvider } from './induction/JobContext'

const AppContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <InductionAssignProvider>
        <DesignationProvider>
          <DepartmentProvider>
            <RoleProvider>
              <RoleAssignmentProvider>
                <PlantProvider>
                  <UserPersonalProvider>
                    <PlantAssignProvider>
                      <JobResponsibilityProvider>
                        <DocumentProvider>
                          {/* <JobProvider> */}
                            {children}
                          {/* </JobProvider> */}
                        </DocumentProvider>
                      </JobResponsibilityProvider>
                    </PlantAssignProvider>
                  </UserPersonalProvider>
                </PlantProvider>
              </RoleAssignmentProvider>
            </RoleProvider>
          </DepartmentProvider>
        </DesignationProvider>
      </InductionAssignProvider>
    </UserProvider>
  );
};

export default AppContextProvider;