import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
