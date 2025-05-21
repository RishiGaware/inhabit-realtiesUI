import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import { JobResponsibilityProvider } from './context/induction/JobResponsibilityContext.jsx';
import { toastConfig } from './utils/toastConfig';
import { Suspense, lazy } from 'react';
import PrivateRoute from './components/PrivateRoute';

// Auth & Landing
const Login = lazy(() => import('./pages/login/Login.jsx'));
const Register = lazy(() => import('./pages/register/Register.jsx'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard.jsx'));
const ForgotPasswordReset = lazy(() => import('./pages/login/ForgotPasswordReset.jsx'));

// System Admin


// Password Configuration
const PasswordConfiguration = lazy(() => import('./pages/systemAdmin/passwordConfiguration/PasswordConfiguration.jsx'));

// Change Password
const ChangePassword = lazy(() => import('./pages/systemAdmin/changePassword/ChangePassword.jsx'));

// // Admin Module
// import AdminDashboard from './modules/admin/pages/Dashboard';
// import AdminReports from './modules/admin/pages/Reports';
// import UserManagement from './modules/admin/pages/UserManagement';

// // Executive Module
// import ExecutiveDashboard from './modules/executive/pages/Dashboard';
// import LeadManagement from './modules/executive/pages/LeadManagement';
// import CustomerManagement from './modules/executive/pages/CustomerManagement';
// import SiteVisits from './modules/executive/pages/SiteVisits';

// // Sales Module
// import SalesDashboard from './modules/sales/pages/Dashboard';
// import Bookings from './modules/sales/pages/Bookings';
// import BookedUnits from './modules/sales/pages/BookedUnits';
// import Payments from './modules/sales/pages/Payments';
// import Handover from './modules/sales/pages/Handover';

// // Client Module
// import ClientDashboard from './modules/client/pages/Dashboard';
// import ClientDocuments from './modules/client/pages/Documents';
// import ClientPayments from './modules/client/pages/Payments';

function App() {
  return (
    <Provider store={store}>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<ForgotPasswordReset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPasswordReset />} />
        </Routes>
      </Suspense>
    </Provider>
  );
}

export default App;
