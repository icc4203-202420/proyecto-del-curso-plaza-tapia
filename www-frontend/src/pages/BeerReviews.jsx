import React, { useReducer, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, List, Typography, CircularProgress, Paper, Card, CardContent, Button } from '@mui/material';

// Reducer function to manage state
const reviewsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, reviews: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error('Unknown action type');
  }
};

const BeerReviews = () => {
  const [beer, setBeer] = useState(null);
  const user_id = parseInt(localStorage.getItem('user_id'));
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reviewsReducer, {
    reviews: [],
    loading: true,
    error: null,
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const beerResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBeer(beerResponse.data.beer);

        dispatch({ type: 'FETCH_SUCCESS', payload: response.data.reviews });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };
    fetchReviews();
  }, [id]);

  const { reviews, loading, error } = state;

  const userReview = reviews.find(review => review.user_id === user_id);
  const otherReviews = reviews.filter(review => review.user_id !== user_id);

  const handleEditReview = (reviewId) => {
    navigate(`/reviews/${reviewId}/edit`);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, width: '80%', margin: 'auto', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Reviews for Beer: {beer ? beer.name : 'Loading...'}
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <List>
            {userReview && (
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">Your Review</Typography>
                  <Typography variant="body2">Rating: {userReview.rating}</Typography>
                  <Typography variant="body2">{userReview.text}</Typography>
                </CardContent>
              </Card>
            )}

            <Button variant="contained" color="secondary" href={`/beers/${id}`}>
              Back
            </Button>

            {!userReview && (
              <Button variant="contained" color="primary" href={`/new-review/${id}`}>
                Add New Review
              </Button>
            )}

            {otherReviews.length > 0 ? (
              otherReviews.map(review => (
                <Card key={review.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="body2">Rating: {review.rating}</Typography>
                    <Typography variant="body2">{review.text}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No reviews found for this beer.</Typography>
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default BeerReviews;
