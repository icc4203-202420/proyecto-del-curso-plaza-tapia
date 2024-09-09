import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const PrivateRoute = () => {
  const user = getCurrentUser();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
