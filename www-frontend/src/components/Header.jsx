import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, AccordionDetails, List, ListItem, ListItemText, Accordion } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentToken } from '../services/authService';
import LogoutButton from './LogoutButton';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(getCurrentToken());
    const [accordionOpen, setAccordionOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = () => {
        setAccordionOpen(prev => !prev);
    };

    const handleLinkClick = (path) => {
        navigate(path);
        setAccordionOpen(false); // Close the accordion after clicking a link
    };

    useEffect(() => {
        const checkToken = () => {
            setIsLoggedIn(getCurrentToken());
        };

        window.addEventListener('storage', checkToken);

        return () => {
            window.removeEventListener('storage', checkToken);
        };
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <AppBar position="fixed" color="default">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                    <ExpandMore />
                </IconButton>
                <Button color="inherit" onClick={handleHomeClick} sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        BarSocial
                    </Typography>
                </Button>
                {isLoggedIn ? (
                    <LogoutButton />
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
            {isLoggedIn ? (
                accordionOpen && (
                    <Accordion expanded={accordionOpen} sx={{ width: '100%' }}>
                        <AccordionDetails>
                            <List>
                                <ListItem button onClick={() => handleLinkClick('/users')}>
                                    <ListItemText primary="Users" />
                                </ListItem>
                                <ListItem button onClick={() => handleLinkClick('/map')}>
                                    <ListItemText primary="Map" />
                                </ListItem>
                                <ListItem button onClick={() => handleLinkClick('/option2')}>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )
            ) : null}
        </AppBar>
    );
};

export default Header;
