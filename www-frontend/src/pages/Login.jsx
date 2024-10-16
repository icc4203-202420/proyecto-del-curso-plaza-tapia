import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user_id', userData.user_id);
      console.log('Login successful', userData);
      navigate('/');
      window.location.reload();
    } catch (error) {console.error('Login failed', error);}
  };

  return (
    <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2, height: 'auto' }}>
      <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '10px 0', mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
      <Button
        color="inherit"
        component={Link}
        to="/register"
        sx={{ mt: 2, textDecoration: 'underline', color: 'primary.main' }}
      >
        Don't have an account? Register
      </Button>
    </Container>
  );
};

export default Login;