import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button} from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
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
                // Store the token in localStorage or a state management solution
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                // Handle registration errors
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <Container maxWidth="sm">
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
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;