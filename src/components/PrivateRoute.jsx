import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role if role doesn't match
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'executive':
        return <Navigate to="/executive/dashboard" replace />;
      case 'sales':
        return <Navigate to="/sales/dashboard" replace />;
      case 'client':
        return <Navigate to="/client/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and role matches (or no role specified), render the child routes
  return <Outlet />;
};

export default PrivateRoute; 