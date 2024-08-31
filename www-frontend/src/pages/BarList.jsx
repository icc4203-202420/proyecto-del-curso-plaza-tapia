import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, InputBase, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { ArrowBack, Search, FilterList, LocationOn, Favorite, LocalBar } from '@mui/icons-material';

const BarsList = () => {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars');
        console.log(response.data); // Verifica los datos recibidos
        const barsData = response.data.bars;
        setBars(barsData);
  
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);
  
        if (history.length > 0) {
          const filtered = barsData.filter(bar =>
            history.some(term => bar.name.toLowerCase().includes(term.toLowerCase()))
          );
          setFilteredBars(filtered);
        } else {
          setFilteredBars(barsData.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };
  
    fetchBars();
  }, []);
  

  useEffect(() => {
    const filterBars = () => {
      if (searchTerm === '') {
        // Si no hay término de búsqueda, mostrar basado en historial
        const barsData = [...bars];
        if (searchHistory.length > 0) {
          const filtered = barsData.filter(bar =>
            searchHistory.some(term =>
              bar.name.toLowerCase().includes(term.toLowerCase())
            )
          );
          setFilteredBars(filtered);
        } else {
          setFilteredBars(barsData.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } else {
        // Filtrar bares según el término de búsqueda
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = bars.filter(bar =>
          bar.name.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredBars(filtered);

        // Actualizar el historial de búsqueda
        const updatedHistory = Array.from(new Set([searchTerm, ...searchHistory]));
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    };

    filterBars();
  }, [searchTerm, bars, searchHistory]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBarsClick = () => {
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200%', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de búsqueda superior */}
      <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
          <InputBase
            placeholder="Search for bars"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ ml: 2, flex: 1 }}
          />
          <IconButton type="submit" color="inherit" aria-label="search">
            <Search />
          </IconButton>
          <IconButton color="inherit" aria-label="filter">
            <FilterList />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Espaciado para evitar que el contenido quede debajo de la AppBar */}
      <Toolbar />

      {/* Contenedor principal */}
      <Button minHeight variant="text" sx={{ mt: 1 }}>
        View History
      </Button>
      <Container centered sx={{ width: '100%'}}>
        <List>
          {filteredBars.length > 0 ? (
            filteredBars.map((bar) => (
              <ListItem key={bar.id} button>
                <ListItemAvatar>
                  <Avatar>{bar.name[0]}</Avatar> {/* Muestra la primera letra del nombre del bar */}
                </ListItemAvatar>
                <ListItemText
                  primary={bar.name}
                  secondary={`Address ID: ${bar.address_id}`}
                  primaryTypographyProps={{ style: { color: 'black' } }} // Cambia el color del texto principal a negro
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No bars found" />
            </ListItem>
          )}
        </List>
      </Container>

      {/* Barra de navegación inferior */}
      <BottomNavigation showLabels sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigationAction label="Home" icon={<LocationOn />} onClick={handleBarsClick} />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Beers" icon={<LocalBar />} />
      </BottomNavigation>
    </div>
  );
};

export default BarsList;
