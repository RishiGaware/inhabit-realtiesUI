import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import { JobResponsibilityProvider } from './context/induction/JobResponsibilityContext.jsx';
import { toastConfig } from './utils/toastConfig';
// Auth & Landing
const Login = lazy(() => import('./pages/login/Login.jsx'));
const Register = lazy(() => import('./pages/register/Register.jsx'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const ForgotPasswordReset = lazy(() => import('./pages/login/ForgotPasswordReset.jsx'));
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

// Change Password
const ChangePassword = lazy(() => import('./pages/systemAdmin/changePassword/ChangePassword.jsx'));

const App = () => {
  return (
    <>
      <ToastContainer {...toastConfig} />
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<ForgotPasswordReset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPasswordReset />} />
          {/* Protected routes with layout */}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
