import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Paper, Button } from '@mui/material';

const BeerDetails = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [bars, setBars] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user_id = parseInt(localStorage.getItem('user_id'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const token = localStorage.getItem('token');

                const beerResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBeer(beerResponse.data.beer);

                const barsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/bars`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBars(barsResponse.data.bars);

                // Fetch reviews for the beer
                const reviewsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReviews(reviewsResponse.data.reviews);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchBeerDetails();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    // Find if the user has already created a review
    const userReview = reviews.find(review => review.user_id === user_id);

    const handleCreateReview = (beerId) => {
        navigate(`/new-review/${beerId}`);
    };

    const handleEditReview = (reviewId) => {
        navigate(`/reviews/${reviewId}/edit`);
    };

    const handleViewReviews = (beerId) => {
        navigate(`/beers/${beerId}/reviews`);
    };

    return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, marginTop: '50px' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {beer && (
                    <>
                        <Typography variant="h4" gutterBottom>{beer.name}</Typography>
                        <Typography variant="body1"><strong>Type:</strong> {beer.beer_type || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Style:</strong> {beer.style || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Hop:</strong> {beer.hop || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Yeast:</strong> {beer.yeast || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Malts:</strong> {beer.malts || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>IBU:</strong> {beer.ibu || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Alcohol:</strong> {beer.alcohol || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>BLG:</strong> {beer.blg || 'N/A'}</Typography>
                        <Typography variant="body1"><strong>Average Rating:</strong> {beer.avg_rating || 'N/A'}</Typography>
                        
                        <Typography variant="h6" sx={{ mt: 4 }}>Bars serving this beer:</Typography>
                        {bars.length > 0 ? (
                            <List sx={{ width: '100%' }}>
                                {bars.map(bar => (
                                    <ListItem key={bar.id}>
                                        <ListItemText primary={bar.name} secondary={`Location: ${bar.latitude}, ${bar.longitude}`} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No bars found for this beer.</Typography>
                        )}

                        {/* Conditional rendering of Create/Edit Review button */}
                        {userReview ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditReview(userReview.id)}
                                sx={{ mt: 4 }}
                            >
                                Edit Review
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleCreateReview(beer.id)}
                                sx={{ mt: 4 }}
                            >
                                Create Review
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewReviews(beer.id)}
                            sx={{ mt: 4 }}
                        >
                            Reviews
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default BeerDetails;
