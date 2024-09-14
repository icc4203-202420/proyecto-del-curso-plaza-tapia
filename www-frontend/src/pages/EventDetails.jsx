import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, CircularProgress, Paper, Container, IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]); // State for attendees
    const [checkedIn, setCheckedIn] = useState(false); // State to track if user has checked in
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch event details and attendees
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch the event details
                const eventResponse = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvent(eventResponse.data.event);

                // Fetch the attendees for the event
                const attendeesResponse = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}/attendances`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttendees(attendeesResponse.data); // Assuming the response contains an array of users

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    // Handle the check-in functionality
    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const user_id = localStorage.getItem('user_id'); // Assuming you store the user_id in localStorage after login

            // Send a POST request to check-in the user
            await axios.post(`http://127.0.0.1:3001/api/v1/events/${id}/attendances`,
                { user_id },  // Send user_id in the request body
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCheckedIn(true); // Set checkedIn to true once successful
        } catch (err) {
            setError(err.message); // Handle errors if the request fails
        }
    };

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

                            {/* Check-In Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCheckIn}
                                disabled={checkedIn} // Disable the button if already checked in
                                sx={{ mt: 2 }}
                            >
                                {checkedIn ? 'Checked In' : 'Check In'} {/* Change text based on check-in status */}
                            </Button>

                            {/* List of attendees */}
                            <Typography variant="h6" sx={{ mt: 2 }}>Attendees</Typography>
                            <List>
                                {attendees.length > 0 ? (
                                    attendees.map(user => (
                                        <ListItem key={user.id}>
                                            <ListItemText
                                                primary={`${user.first_name} ${user.last_name}`}
                                                secondary={`Handle: ${user.handle}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No attendees yet.</Typography>
                                )}
                            </List>
                        </>
                    )}
                </Paper>
            </Container>
        </Container>
    );
};

export default EventDetails;