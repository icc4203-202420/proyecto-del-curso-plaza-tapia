import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentToken } from '../services/authService';

const PrivateRoute = () => {
  const token = getCurrentToken();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
