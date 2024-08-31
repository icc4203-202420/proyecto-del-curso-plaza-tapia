import React, { useState } from 'react';
import { Container, TextField } from '@mui/material';

const UserSearch = () => {
  const [search, setSearch] = useState('');

  return (
    <Container>
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Container>
  );
};

export default UserSearch;
