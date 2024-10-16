import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, InputBase, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import { ArrowBack, Search, Clear } from '@mui/icons-material';

const BarsList = () => {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        const barsData = response.data.bars;
        setBars(barsData);
        setFilteredBars(barsData);

        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBars(bars);
    }
  }, [searchTerm, bars]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBarClick = (id) => {
    navigate(`/bars/${id}/events`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const updatedHistory = Array.from(new Set([searchTerm, ...searchHistory]));
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = bars.filter(bar =>
        bar.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredBars(filtered);
    } else {
      setFilteredBars(bars);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredBars(bars);
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', marginTop: 2, height: '100vh', marginBottom: "200px", paddingBottom: "200px" }}>
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
            onKeyDown={handleKeyDown}
            sx={{ ml: 2, flex: 1 }}
          />
          <IconButton color="inherit" aria-label="clear" onClick={handleClearSearch}>
            <Clear />
          </IconButton>
          <IconButton color="inherit" aria-label="search" onClick={handleSearch}>
            <Search />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Button variant="text" onClick={handleViewHistory} sx={{}}>
        View History
      </Button>
      {showHistory && (
        <Box sx={{ mb: 2, alignContent: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', color: 'text.primary' }}>
            {searchHistory.length > 0 ? (
              searchHistory.map((term, index) => (
                <ListItem key={index} button onClick={() => {
                  setSearchTerm(term);
                  handleSearch();
                }}>
                  <ListItemText primary={term} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No search history" />
              </ListItem>
            )}
            <Button variant="text" onClick={() => {
              setSearchHistory([]);
              localStorage.removeItem('searchHistory');
            }}>
              Clear History
            </Button>
          </List>
        </Box>
      )}

      <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 3 }}>
        <List>
          {filteredBars.length > 0 ? (
            filteredBars.map((bar) => (
              <ListItem key={bar.id} button onClick={() => handleBarClick(bar.id)}>
                <ListItemAvatar>
                  <Avatar>{bar.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={bar.name}
                  secondary={`Location: ${bar.location}`}
                  primaryTypographyProps={{ style: { color: 'black' } }}
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
    </Container>
  );
};

export default BarsList;
