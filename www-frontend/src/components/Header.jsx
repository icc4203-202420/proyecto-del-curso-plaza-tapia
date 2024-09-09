import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, AccordionDetails, List, ListItem, ListItemText, Accordion } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import LogoutButton from './LogoutButton';

const Header = ({ handleMenuClick, accordionOpen }) => {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    useEffect(() => {
        const checkUser = () => {
            setCurrentUser(getCurrentUser());
        };

        window.addEventListener('storage', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    return (
        <AppBar position="fixed" color="default">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                    <ExpandMore />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    BarSocial
                </Typography>
                {currentUser ? (
                    <LogoutButton />
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>

                )}


            </Toolbar>
            {accordionOpen && (
                <Accordion expanded={accordionOpen} sx={{ width: '100%' }}>
                    <AccordionDetails>
                        <List>
                            <ListItem button component={Link} to="/users">
                                <ListItemText primary="Users" />
                            </ListItem>
                            <ListItem button component={Link} to="/option1">
                                <ListItemText primary="Option 1" />
                            </ListItem>
                            <ListItem button component={Link} to="/option2">
                                <ListItemText primary="Option 2" />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            )}
        </AppBar>
    );
};

export default Header;