import Login from './components/login/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard';

// System Admin

// User Master
import UserMaster from './components/Sections/SystemAdmin/UserMaster/UserMaster.jsx';
import UserMasterAddUser from './components/Sections/SystemAdmin/UserMaster/AddUser/AddUser.jsx';
import UserMasterEditUser from './components/Sections/SystemAdmin/UserMaster/EditUser/EditUser.jsx';

// User Profile
import UserProfile from './components/Sections/SystemAdmin/UserProfile/UserProfile.jsx';
import UserProfileAddUser from './components/Sections/SystemAdmin/UserProfile/AddUser/AddUser.jsx';
import UserProfileEditUser from './components/Sections/SystemAdmin/UserProfile/EditUser/EditUser.jsx';

const routes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/system-admin',
    children: [
      {
        path: 'user-master',
        element: <UserMaster />,
        children: [
          { path: 'add-user', element: <UserMasterAddUser /> },
          { path: 'edit-user', element: <UserMasterEditUser /> },
        ],
      },
      {
        path: 'user-profile',
        element: <UserProfile />,
        children: [
          { path: 'add-user', element: <UserProfileAddUser /> },
          { path: 'edit-user', element: <UserProfileEditUser /> },
        ],
      },
    ],
  },
];

export default routes;
