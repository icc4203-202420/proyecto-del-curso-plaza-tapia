import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, InputBase, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch all users from the backend when the component loads
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:3001/api/v1/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const usersData = response.data.users;
                setUsers(usersData);
                setFilteredUsers(usersData); // Initially show all users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users by search term
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredUsers(users.sort((a, b) => a.handle.localeCompare(b.handle))); // Show all users sorted by handle if no search term
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = users.filter(user =>
                user.handle.toLowerCase().includes(lowercasedTerm) ||
                user.first_name.toLowerCase().includes(lowercasedTerm) ||
                user.last_name.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredUsers(filtered.sort((a, b) => a.handle.localeCompare(b.handle))); // Filtered users sorted by handle
        }
    }, [searchTerm, users]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update search term as the user types
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`); // Navigate to the user's profile page
    };

    return (
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2, height: 'auto' }}>
            <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBackClick}>
                        <ArrowBack />
                    </IconButton>
                    <InputBase
                        placeholder="Search for users by handle, first name, or last name"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ ml: 2, flex: 1 }}
                    />
                    <IconButton type="submit" color="inherit" aria-label="search">
                        <Search />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Toolbar />

            <Container sx={{ width: '100%' }}>
                <List>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <ListItem key={user.id} button onClick={() => handleUserClick(user.id)}>
                                <ListItemAvatar>
                                    <Avatar>{user.first_name[0]}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user.first_name} ${user.last_name}`}
                                    secondary={`Handle: ${user.handle}`}
                                    primaryTypographyProps={{ style: { color: 'black' } }}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No users found" />
                        </ListItem>
                    )}
                </List>
            </Container>
        </Container>
    );
};

export default UserList;