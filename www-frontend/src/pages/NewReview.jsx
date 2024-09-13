import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Slider, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const NewReview = () => {
  const { id } = useParams();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1); // Set initial rating to 1
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const beerId = id;

    try {
      await axios.post('http://127.0.0.1:3001/api/v1/reviews', {
        review: {
          text,
          rating,
          beer_id: beerId
        },
        user_id: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/beers/' + beerId + '/reviews');
    } catch (err) {
      setError('Error creating review');
      console.error(err);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ color: 'black' }}>Create Review</Typography>
      <Typography variant="h6" sx={{ color: 'black' }}>Rating</Typography>
      <form onSubmit={handleSubmit}>
        <Slider
          label="Rating"
          value={rating}
          onChange={handleRatingChange}
          aria-labelledby="rating-slider"
          min={1}
          max={5}
          step={0.1}
          marks={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
          ]}
          valueLabelDisplay="auto"
          sx={{ color: 'black' }}
        />
        <Typography variant="h6" sx={{ color: 'black' }}>Review Text</Typography>
        <TextField
          label="Review Text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            sx: { color: 'black' } // Ensuring the input text is black
          }}
        />
        {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </form>
    </Container>
  );
};

export default NewReview;
