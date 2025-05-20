// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService'

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <Route
      {...rest}
      element={isAuthenticated ? Component : <Navigate to="/" />}
    />
  );
};

export default ProtectedRoute;