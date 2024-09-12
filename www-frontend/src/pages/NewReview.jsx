import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const NewReview = () => {
  const { id } = useParams(); // Obtiene el beerId de la URL
  const [text, setText] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    try {
      await axios.post('http://127.0.0.1:3001/api/v1/reviews', {
        review: {
          text,
          rating,
          user_id: userId,
          beer_id: id, // Usa el beerId obtenido de useParams
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/reviews'); // Redirige después de la creación exitosa
    } catch (err) {
      setError('Error creating review');
      console.error(err);
    }
  };

  return (
    <Container>
      <h1>Create Review</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Review Text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <TextField
          label="Rating"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </form>
    </Container>
  );
};

export default NewReview;
