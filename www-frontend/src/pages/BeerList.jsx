import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, InputBase, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { ArrowBack, Search, FilterList, LocationOn, Favorite, LocalBar } from '@mui/icons-material';

const BeersList = () => {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/v1/beers');
        const beersData = response.data.beers;
        setBeers(beersData);

        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);

        if (history.length > 0) {
          const filtered = beersData.filter(beer =>
            history.some(term => beer.name.toLowerCase().includes(term.toLowerCase()))
          );
          setFilteredBeers(filtered);
        } else {
          setFilteredBeers(beersData.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error('Error fetching beers:', error);
      }
    };

    fetchBeers();
  }, []);


  useEffect(() => {
    const filterBeers = () => {
      if (searchTerm === '') {
        const beersData = [...beers];
        if (searchHistory.length > 0) {
          const filtered = beersData.filter(beer =>
            searchHistory.some(term =>
              beer.name.toLowerCase().includes(term.toLowerCase())
            )
          );
          setFilteredBeers(filtered);
        } else {
          setFilteredBeers(beersData.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } else {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = beers.filter(beer =>
          beer.name.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredBeers(filtered);

        const updatedHistory = Array.from(new Set([searchTerm, ...searchHistory]));
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    };

    filterBeers();
  }, [searchTerm, beers, searchHistory]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBarsClick = () => {
    navigate('/');
  };

  const handleBeerClick = (id) => {
    navigate(`/beers/${id}`); // Navigate to the beer details page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: window.innerWidth, minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
          <InputBase
            placeholder="Search for beers"
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

      <Toolbar />

      <Button variant="text" sx={{ mt: 1 }}>
        View History
      </Button>
      <Container sx={{ width: '100%' }}>
        <List>
          {filteredBeers.length > 0 ? (
            filteredBeers.map((beer) => (
              <ListItem key={beer.id} button onClick={() => handleBeerClick(beer.id)}>
                <ListItemAvatar>
                  <Avatar>{beer.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={beer.name}
                  secondary={`Brewery: ${beer.brewery}`} // Adjust as needed for brewery field
                  primaryTypographyProps={{ style: { color: 'black' } }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No beers found" />
            </ListItem>
          )}
        </List>
      </Container>
    </div>
  );
};

export default BeersList;