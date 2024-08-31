import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BarEvents = () => {
  const { id } = useParams(); // Obtener el ID del bar de la URL
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/events/${id}`);
        console.log('API response:', response.data); // Verifica la estructura de la respuesta
        setEvents(response.data.events || response.data); // Ajusta según la estructura real de la respuesta
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de título */}
      <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Events at Bar
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Espaciado para evitar que el contenido quede debajo de la AppBar */}
      <Toolbar />

      {/* Contenedor principal */}
      <Container sx={{ mt: 8, mb: 4, bgcolor: '#ffffff', minHeight: '100vh', width: window.innerWidth }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {events.length > 0 ? (
              events.map(event => (
                <ListItem key={event.id}>
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
    </div>
  );
};

export default BarEvents;
