import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Typography, CircularProgress, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BeerDetails = () => {
    const { id } = useParams(); // Obtener el ID de la cerveza de la URL
    const [beer, setBeer] = useState(null);
    const [bars, setBars] = useState([]); // Add state for bars
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                // Fetch beer details
                const beerResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                setBeer(beerResponse.data.beer);

                // Fetch bars that serve this beer
                const barsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}/bars`);
                setBars(barsResponse.data.bars); // Assuming the API returns a 'bars' array

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* AppBar */}
            <AppBar position="fixed" color="default" sx={{ width: '100%' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate('/')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Beer Details
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Spacer for AppBar */}
            <Toolbar />

            {/* Main Content */}
            <Container sx={{ mt: 8, mb: 4, bgcolor: '#ffffff', minHeight: '100vh', width: window.innerWidth }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    {beer && (
                        <>
                            <Typography variant="h4">{beer.name}</Typography>
                            <Typography><strong>Type:</strong> {beer.beer_type || 'N/A'}</Typography>
                            <Typography><strong>Style:</strong> {beer.style || 'N/A'}</Typography>
                            <Typography><strong>Hop:</strong> {beer.hop || 'N/A'}</Typography>
                            <Typography><strong>Yeast:</strong> {beer.yeast || 'N/A'}</Typography>
                            <Typography><strong>Malts:</strong> {beer.malts || 'N/A'}</Typography>
                            <Typography><strong>IBU:</strong> {beer.ibu || 'N/A'}</Typography>
                            <Typography><strong>Alcohol:</strong> {beer.alcohol || 'N/A'}</Typography>
                            <Typography><strong>BLG:</strong> {beer.blg || 'N/A'}</Typography>
                            <Typography><strong>Average Rating:</strong> {beer.avg_rating || 'N/A'}</Typography>

                            {/* Display list of bars */}
                            <Typography variant="h6" sx={{ mt: 4 }}>Bars serving this beer:</Typography>
                            {bars.length > 0 ? (
                                <List>
                                    {bars.map(bar => (
                                        <ListItem key={bar.id}>
                                            <ListItemText primary={bar.name} secondary={`Location: ${bar.latitude}, ${bar.longitude}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography>No bars found for this beer.</Typography>
                            )}
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default BeerDetails;