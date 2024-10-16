import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BarEvents = () => {
  const { id } = useParams();
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/bars/${id}/events`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('API response:', response.data);
        setEvents(response.data.events);
        setBar(response.data.bar);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const handleEventClick = (eventId) => {
    // Navigate to the event's detail view
    navigate(`/events/${eventId}`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2, height: 'auto' }}>
      <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Events at {bar?.name || 'Loading...'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ mt: 8, mb: 4, bgcolor: '#ffffff', minHeight: '100vh', width: window.innerWidth }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {events.length > 0 ? (
              events.map(event => (
                <ListItem button key={event.id} onClick={() => handleEventClick(event.id)}>
                  <ListItemText
                    primary={event.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {event.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No events found.</Typography>
            )}
          </List>
        </Paper>
      </Container>
    </Container>
  );
};

export default BarEvents;