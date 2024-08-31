import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import { ArrowBack, Search, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: window.innerWidth, minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de búsqueda superior */}
      <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
          <InputBase
            placeholder="Search for users"
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
      <Container sx={{ width: '100%' }}>
        {/* Placeholder para la lista de usuarios */}
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>A</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="User Name"
              secondary="User Details"
              primaryTypographyProps={{ style: { color: 'black' } }}
            />
          </ListItem>
          {/* Agrega más ListItems como ejemplos */}
        </List>
      </Container>
    </div>
  );
};

export default UsersList;
