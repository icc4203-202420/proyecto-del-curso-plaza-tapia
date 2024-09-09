import React, { useState } from 'react';
import { Toolbar, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleMenuClick = () => {
    setAccordionOpen(prev => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header handleMenuClick={handleMenuClick} accordionOpen={accordionOpen} />

      <Toolbar />

      {/* Contenido principal */}
      <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2 }}>
        <Grid container spacing={2} sx={{ flex: 1 }}>
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Friends</Typography>
                <Typography color="textSecondary">
                  Find your friends’ beers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Top of the week</Typography>
                <Typography color="textSecondary">
                  Top bars of the week
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">My bars</Typography>
                <Typography color="textSecondary">
                  Your favorite bars
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">My beers</Typography>
                <Typography color="textSecondary">
                  Your favorite beers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
      
    </div>
  );
};

export default Home;
