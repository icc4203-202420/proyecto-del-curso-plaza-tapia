import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';

const BarEvents = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, [id]);

  return (
    <Container>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography color="text.secondary">{event.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarEvents;
