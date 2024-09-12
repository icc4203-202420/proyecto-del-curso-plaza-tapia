import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, CircularProgress, Paper, Container, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEvent(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2, height: 'auto' }}>
            <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Event Details
                    </Typography>
                </Toolbar>
            </AppBar>

            <Toolbar />

            <Container sx={{ mt: 8, mb: 4, bgcolor: '#ffffff', minHeight: '100vh', width: window.innerWidth }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    {event && (
                        <>
                            <Typography variant="h4">{event.name}</Typography>
                            <Typography><strong>Description:</strong> {event.description}</Typography>
                            <Typography><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
                            <Typography><strong>Location:</strong> {event.location || 'N/A'}</Typography>
                        </>
                    )}
                </Paper>
            </Container>
        </Container>
    );
};

export default EventDetails;