// src/components/Search.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';

const Search = () => {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location) {
      navigate(`/${location}`);
    }
  };

  return (
    <Container>
      <TextField
        label="Enter city name"
        variant="outlined"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: '20px' }}
      >
        Search
      </Button>
    </Container>
  );
};

export default Search;