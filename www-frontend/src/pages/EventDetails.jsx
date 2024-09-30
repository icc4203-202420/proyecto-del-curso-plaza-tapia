import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, CircularProgress, Paper, Container, IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [friends, setFriends] = useState([]);
    const [checkedIn, setCheckedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const eventResponse = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvent(eventResponse.data.event);

                const attendeesResponse = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}/attendances`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttendees(attendeesResponse.data);

                const isUserCheckedIn = attendeesResponse.data.some(attendee => attendee.id === parseInt(user_id));
                setCheckedIn(isUserCheckedIn);

                const friendsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/users/${user_id}/friendships`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(friendsResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user_id]);

    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:3001/api/v1/events/${id}/attendances`,
                { user_id },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCheckedIn(true);
            const newUser = { id: parseInt(user_id), first_name: "You", last_name: "", handle: "current_user" };
            setAttendees(prev => [...prev, newUser]);
        } catch (err) {
            setError(err.message);
        }
    };

    const friendsAttendees = attendees.filter(attendee => friends.some(friend => friend.id === attendee.id));
    const nonFriendsAttendees = attendees.filter(attendee => !friendsAttendees.includes(attendee));

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

                            {checkedIn && (
                                <Typography sx={{ color: 'green', mt: 2 }}>
                                    You are checked in!
                                </Typography>
                            )}

                            {!checkedIn && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCheckIn}
                                    sx={{ mt: 2 }}
                                >
                                    Check In
                                </Button>
                            )}

                            {/* Button to navigate to PhotoCapture */}
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate(`/photo-capture/${id}`)} // Navigate to PhotoCapture with event ID
                                sx={{ mt: 2 }}
                            >
                                Capture Photo
                            </Button>

                            {/* List of attendees */}
                            <Typography variant="h6" sx={{ mt: 2 }}>Your Friends</Typography>
                            <List>
                                {friendsAttendees.length > 0 ? (
                                    friendsAttendees.map(user => (
                                        <ListItem key={user.id}>
                                            <ListItemText
                                                primary={`${user.first_name} ${user.last_name}`}
                                                secondary={`Handle: ${user.handle}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No friends attending.</Typography>
                                )}
                            </List>

                            <Typography variant="h6" sx={{ mt: 2 }}>Other Attendees</Typography>
                            <List>
                                {nonFriendsAttendees.length > 0 ? (
                                    nonFriendsAttendees.map(user => (
                                        <ListItem key={user.id}>
                                            <ListItemText
                                                primary={`${user.first_name} ${user.last_name}`}
                                                secondary={`Handle: ${user.handle}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No other attendees.</Typography>
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
