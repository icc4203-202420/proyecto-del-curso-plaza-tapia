import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, IconButton, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Settings, MoreVert, LocationOn, Favorite, LocalBar } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de navegación superior fija */}
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="settings">
            <Settings />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            BarSocial
          </Typography>
          <Button color="inherit">Profile</Button>
        </Toolbar>
      </AppBar>

      {/* Espaciado para evitar que el contenido quede debajo de la AppBar */}
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
                <IconButton aria-label="more" sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <MoreVert />
                </IconButton>
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
                <IconButton aria-label="more" sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <MoreVert />
                </IconButton>
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
                <IconButton aria-label="more" sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <MoreVert />
                </IconButton>
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
                <IconButton aria-label="more" sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <MoreVert />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Barra de navegación inferior */}
      <BottomNavigation showLabels sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigationAction
          label="Bars"
          icon={<LocationOn />}
          component={Link} 
          to="/bars"
        />
        <BottomNavigationAction
          label="Favorites"
          icon={<Favorite />}
        />
        <BottomNavigationAction 
          label="Beers" 
          icon={<LocalBar />}
          component={Link} 
          to="/beers"
        />
      </BottomNavigation>
    </div>
  );
};

export default Home;
