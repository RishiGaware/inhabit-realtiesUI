import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import {ToastContainer} from 'react-toastify';
import Layout from './components/layout/Layout';
import { JobResponsibilityProvider } from './context/induction/JobResponsibilityContext.jsx';
// Auth & Landing
const Login = lazy(() => import('./pages/login/Login.jsx'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const PlantSelectionLandingPage = lazy(() => import('./pages/landingPage/plantSelectLandingPage/plantSelectLandingPage.jsx'));

// System Admin

// User Master
const UserMaster = lazy(() => import('./pages/systemAdmin/userMaster/UserMaster.jsx'));
const UserMasterAddUser = lazy(() => import('./pages/systemAdmin/userMaster/AddUser/AddUser.jsx'));
const UserMasterEditUser = lazy(() => import('./pages/systemAdmin/userMaster/EditUser/EditUser.jsx'));

// User Personal Details
const UserProfile = lazy(() => import('./pages/systemAdmin/userPersonalDetails/UserPersonalDetails.jsx'));
const UserProfileAddUser = lazy(() => import('./pages/systemAdmin/userPersonalDetails/AddUser/AddUser.jsx'));
const UserProfileEditUser = lazy(() => import('./pages/systemAdmin/userPersonalDetails/EditUser/EditUser.jsx'));

// Password Configuration
const PasswordConfiguration = lazy(() => import('./pages/systemAdmin/passwordConfiguration/PasswordConfiguration.jsx'));
// Password Configuration
// const PasswordConfiguration = lazy(() => import('./pages/systemAdmin/passwordConfiguration/PasswordConfiguration.jsx'));

// Change Password
const ChangePassword = lazy(() => import('./pages/systemAdmin/changePassword/ChangePassword.jsx'));
// Change Password
// const ChangePassword = lazy(() => import('./pages/systemAdmin/changePassword/ChangePassword.jsx'));

// Department Master
const DepartmentMaster = lazy(() => import('./pages/systemAdmin/departmentMaster/DepartmentMaster.jsx'));
const AddDepartment = lazy(() => import('./pages/systemAdmin/departmentMaster/addDepartmentMaster/AddDepartment.jsx'));
const EditDepartment = lazy(() => import('./pages/systemAdmin/departmentMaster/editDepartmentMaster/EditDepartment.jsx'));

// Designation Master
const DesignationMaster = lazy(() => import('./pages/systemAdmin/designationMaster/DesignationMaster.jsx'));
const AddDesignation = lazy(() => import('./pages/systemAdmin/designationMaster/addDesignationMaster/AddDesignation.jsx'));
const EditDesignation = lazy(() => import('./pages/systemAdmin/designationMaster/editDesignationMaster/EditDesignation.jsx'));

// Role Master
const RoleMaster = lazy(() => import('./pages/systemAdmin/roleMaster/RoleMaster.jsx'));
const AddRole = lazy(() => import('./pages/systemAdmin/roleMaster/addRoleMaster/AddRole.jsx'));
const EditRole = lazy(() => import('./pages/systemAdmin/roleMaster/editRoleMaster/EditRole.jsx'));

// Plant Master
const PlantMaster = lazy(() => import('./pages/systemAdmin/plantMaster/PlantMaster.jsx'));
const AddPlant = lazy(() => import('./pages/systemAdmin/plantMaster/addPlantMaster/AddPlant.jsx'));
const EditPlant = lazy(() => import('./pages/systemAdmin/plantMaster/editPlantMaster/EditPlant.jsx'));

// Plant Assign
const PlantAssign = lazy(() => import('./pages/systemAdmin/plantAssign/PlantAssign.jsx'));
const AddPlantAssign = lazy(() => import('./pages/systemAdmin/plantAssign/AddPlantAssign/AddPlantAssign.jsx'));
const EditPlantAssign = lazy(() => import('./pages/systemAdmin/plantAssign/EditPlantAssign/EditPlantAssign.jsx'));

// Forgot Password
const ForgotPasswordReset = lazy(() => import('./pages/login/ForgotPasswordReset.jsx'));

//Password Reset
const PasswordReset = lazy(() => import('./pages/systemAdmin/passwordReset/PasswordReset.jsx'));

// Induction Assign
const InductionAssign = lazy(() => import('./pages/induction/inductionAssign/InductionAssign.jsx'));
const AddInductionAssign = lazy(() => import('./pages/induction/inductionAssign/addInductionAssign/AddInductionAssign.jsx'));
const EditInductionAssign = lazy(() => import('./pages/induction/inductionAssign/editInductionAssign/EditInductionAssign.jsx'));

//Induction Sign
const InductionSign = lazy(() => import('./pages/induction/inductionSign/InductionSign.jsx'));

// Role Assignment
const RoleAssignment = lazy(() => import('./pages/systemAdmin/roleAssignment/RoleAssignment.jsx'));
const AddRoleAssignment = lazy(() => import('./pages/systemAdmin/roleAssignment/addRoleAssignment/AddRoleAssignment.jsx'));
const EditRoleAssignment = lazy(() => import('./pages/systemAdmin/roleAssignment/editRoleAssignment/EditRoleAssignment.jsx'));

// Profile
const Profile = lazy(() => import('./pages/profile/Profile.jsx'));

// Induction Module
const JobResposibility = lazy(() => import('./pages/induction/jobResponsibility/JobResponsibility.jsx'));
const AddJobResposibility = lazy(() => import('./pages/induction/jobResponsibility/addJobResponsibility/AddJobResponsibility.jsx'));
const EditJobResposibility = lazy(() => import('./pages/induction/jobResponsibility/editJobResponsibility/EditJobResponsibility.jsx'));




// SOP/OJT Management

// Document Registration
const DocumentRegistration = lazy(() => import('./pages/sopojt-Management/documentRegistration/DocumentRegistration.jsx'));
const RegisterDocument = lazy(() => import('./pages/sopojt-Management/documentRegistration/register/RegisterDocument.jsx'));
const EditDocument = lazy(() => import('./pages/sopojt-Management/documentRegistration/update/EditDocument.jsx'));


// Document Review & Approval
const DocumentReviewApproval = lazy(() => import('./pages/sopojt-Management/documentReview&Approval/documentReview&Approval.jsx'));

function App() {
  return (
    <Suspense
  fallback={
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div className="spinnerc"></div>
    </div>
  }
>
      <Routes>
        {/* Public routes without layout */}
        <Route path="/" element={<Login />} />
        <Route path="/password-reset" element={<ForgotPasswordReset />} />

        {/* Protected routes with layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/select-plant" element={<PlantSelectionLandingPage />} />

          {/* User Master routes */}
          <Route path='/system-admin/user-master' element={<UserMaster/>}/>
          <Route path="/system-admin/user-master/add-user" element={<UserMasterAddUser />} />
          <Route path="/system-admin/user-master/edit-user" element={<UserMasterEditUser />} />

          {/* Department Master */}
          <Route path='/system-admin/department-master' element={<DepartmentMaster/>}/>
          <Route path='/system-admin/department-master/add-department' element={<AddDepartment/>}/>
          <Route path='/system-admin/department-master/edit-department' element={<EditDepartment/>}/>
    
          {/* Plant Master */}
          <Route path='/system-admin/plant-master' element={<PlantMaster/>}/>
          <Route path='/system-admin/plant-master/add-plant' element={<AddPlant/>}/>
          <Route path='/system-admin/plant-master/edit-plant' element={<EditPlant/>}/>
          
          {/* Plant Assign */}
          <Route path='/system-admin/plant-assign' element={<PlantAssign/>}/>
          <Route path='system-admin/plant-assign/add-plant-assign' element={<AddPlantAssign/>}/>
          <Route path='/system-admin/plant-assign/edit-plant-assign' element={<EditPlantAssign/>}/>

          {/* Designation Master */}
          <Route path='/system-admin/designation-master' element={<DesignationMaster/>}/>
          <Route path='/system-admin/designation-master/add-designation' element={<AddDesignation/>}/>
          <Route path='/system-admin/designation-master/edit-designation' element={<EditDesignation/>}/>

          {/* Role Master */}
          <Route path='/system-admin/role-master' element={<RoleMaster/>}/>
          <Route path='/system-admin/role-master/add-role' element={<AddRole/>}/>
          <Route path='/system-admin/role-master/edit-role' element={<EditRole/>}/>

          {/* Role Assignment */}
          <Route path='/system-admin/role-assignment' element={<RoleAssignment/>}/>
          <Route path='/system-admin/role-assignment/add-role-assignment' element={<AddRoleAssignment/>}/>
          <Route path='/system-admin/role-assignment/edit-role-assignment' element={<EditRoleAssignment/>}/>

          {/* User Personal Details Routes */}
          <Route path="/system-admin/user-personal-details" element={<UserProfile/>} />
          <Route path="/system-admin/user-personal-details/add-user" element={<UserProfileAddUser/>} />
          <Route path="/system-admin/user-personal-details/edit-user" element={<UserProfileEditUser />} />

          {/* Password Configuration Routes */}
          <Route path="/system-admin/password-configuration" element={<PasswordConfiguration/>} />

          {/* Change Password */}
          <Route path="/profile/password-change" element={<ChangePassword/>} />

          {/* Forgot Password */}
          <Route path="/password-reset" element={<ForgotPasswordReset/>} />


        {/* Password Reset */}
        <Route path="/system-admin/password-reset" element={<PasswordReset/>} />

          {/* Profile */}
          <Route path="/profile" element={<Profile/>} />

          {/* Induction Assign */}
          <Route path="/induction/induction-assign" element={<InductionAssign/>} />
          <Route path="/induction/induction-assign/add-induction-assign" element={<AddInductionAssign/>} />
          <Route path="/induction/induction-assign/edit-induction-assign" element={<EditInductionAssign/>} />

          {/* Induction Module */}
          <Route path="/induction/job-responsibility" element={<JobResposibility />} />
          <Route path="/induction/job-responsibility/add-job-responsibility" element={<AddJobResposibility/>} />
          <Route path="/induction/job-responsibility/edit-job-responsibility" element={<EditJobResposibility />} />
          
          {/* Induction Sign */}
          <Route path="/induction/induction-sign" element={<InductionSign/>} />
          {/* Role Assignment */}
          {/* Induction Sign */}
          <Route path="/induction/induction-sign" element={<InductionSign/>} />
          {/* Role Assignment */}


          {/* SOP Module */}
          <Route path="/sopojt-management/document-registration" element={<DocumentRegistration/>} />
          <Route path="/sopojt-management/document-registration/register-document" element={<RegisterDocument/>} />
          <Route path="/sopojt-management/document-registration/edit-document" element={<EditDocument/>} />

          {/* Document Review & Approval */}
          <Route path="sopojt-management/document-review--approval" element={<DocumentReviewApproval/>} />
          /</Route>
        </Routes> 
        <ToastContainer/>
    </Suspense>
  );
}

export default App;



