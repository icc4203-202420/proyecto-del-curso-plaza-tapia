import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Slider, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const NewReview = () => {
  const { id } = useParams();  // `id` es el `beer_id`
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1); // Set initial rating to 1
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // UseEffect para obtener la revisión existente
  useEffect(() => {
    const fetchReview = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const existingReview = response.data.review;
        
        if (existingReview) {
          setText(existingReview.text);
          setRating(existingReview.rating);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching review');
        console.error(err);
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ color: 'black' }}>Edit Review</Typography>
      <Typography variant="h6" sx={{ color: 'black' }}>Rating</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: 300, marginTop: 2, marginBottom: 2 }}>
          <Slider
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
            sx={{ color: 'primary.main' }}
          />
        </Box>
        <Typography gutterBottom sx={{ color: 'black' }}>Rating: {rating}</Typography>

        <Typography variant="h6" sx={{ color: 'black' }}>Review Text</Typography>
        <TextField
          label="Review Text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            sx: { color: 'black' }
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
