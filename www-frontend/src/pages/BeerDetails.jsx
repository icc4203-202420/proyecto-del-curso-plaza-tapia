import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Paper, Button } from '@mui/material';

const BeerDetails = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const beerResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setBeer(beerResponse.data.beer);
                const barsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/bars`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setBars(barsResponse.data.bars);
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

    const handleCreateReview = (beerId) => {
        navigate(`/new-review/${beerId}`);
    };

    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper elevation={3} sx={{
                p: 4,
                width: '70%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}>
                {beer && (
                    <>
                        <Typography variant="h4" gutterBottom>{beer.name}</Typography>
                        <Typography><strong>Type:</strong> {beer.beer_type || 'N/A'}</Typography>
                        <Typography><strong>Style:</strong> {beer.style || 'N/A'}</Typography>
                        <Typography><strong>Hop:</strong> {beer.hop || 'N/A'}</Typography>
                        <Typography><strong>Yeast:</strong> {beer.yeast || 'N/A'}</Typography>
                        <Typography><strong>Malts:</strong> {beer.malts || 'N/A'}</Typography>
                        <Typography><strong>IBU:</strong> {beer.ibu || 'N/A'}</Typography>
                        <Typography><strong>Alcohol:</strong> {beer.alcohol || 'N/A'}</Typography>
                        <Typography><strong>BLG:</strong> {beer.blg || 'N/A'}</Typography>
                        <Typography><strong>Average Rating:</strong> {beer.avg_rating || 'N/A'}</Typography>
                        <Typography variant="h6" sx={{ mt: 4 }}>Bars serving this beer:</Typography>
                        {bars.length > 0 ? (
                            <List sx={{ width: '100%' }}>
                                {bars.map(bar => (
                                    <ListItem key={bar.id}>
                                        <ListItemText primary={bar.name} secondary={`Location: ${bar.latitude}, ${bar.longitude}`} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (<Typography>No bars found for this beer.</Typography>)}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCreateReview(beer.id)}
                            sx={{ mt: 4 }}
                        >
                            Create Review
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default BeerDetails;
