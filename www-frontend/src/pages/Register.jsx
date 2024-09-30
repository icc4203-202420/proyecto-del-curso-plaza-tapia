import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper} from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(''); // TODO: Add age field
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password,
                        password_confirmation: password2,
                        first_name,
                        last_name,
                        handle: username,
                        age: parseInt(age, 10)
                    }
                }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            }
            else { console.error('Registration failed');}
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2 }}>
            <Paper elevation={6} sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField 
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Repeat Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Register
                    </Button>
                </form>
            </Paper>
            <Button 
                color="inherit" 
                component={Link} 
                to="/login" 
                sx={{ mt: 2, textDecoration: 'underline', color: 'primary.main' }}
            >
                Already have an account? Login
            </Button>
        </Container>
    );
};

export default Register;
