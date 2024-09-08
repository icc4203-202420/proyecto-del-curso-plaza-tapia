import React, { useState } from 'react';
import { Container, TextField, Button} from '@mui/icons-material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ username, email, password, password2 });
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
