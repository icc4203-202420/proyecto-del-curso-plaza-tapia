import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BeerDetails = () => {
    const { id } = useParams(); // Get the beer ID from the route params
    const [beer, setBeer] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                setBeer(response.data.beer);
                if (response.data.brand_id) {
                    const breweryResponse = await axios.get(`http://127.0.0.1:3001/api/v1/brands/${response.data.brand_id}`);
                    setBrewery(breweryResponse.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching beer details:', error);
                setLoading(false);
            }
        };

        fetchBeerDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!beer) {
        return <div>Beer not found.</div>;
    }


    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>{beer.name}</h1>

            <p><strong>Type:</strong> {beer.beer_type || 'N/A'}</p>
            <p><strong>Style:</strong> {beer.style || 'N/A'}</p>
            <p><strong>Hop:</strong> {beer.hop || 'N/A'}</p>
            <p><strong>Yeast:</strong> {beer.yeast || 'N/A'}</p>
            <p><strong>Malts:</strong> {beer.malts || 'N/A'}</p>
            <p><strong>IBU:</strong> {beer.ibu || 'N/A'}</p>
            <p><strong>Alcohol:</strong> {beer.alcohol || 'N/A'}</p>
            <p><strong>BLG:</strong> {beer.blg || 'N/A'}</p>
            <p><strong>Average Rating:</strong> {beer.avg_rating !== null ? beer.avg_rating : 'N/A'}</p>

            {/* Render the brewery details if available */}
            {brewery && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Brewery Information</h2>
                    <p><strong>Brewery Name:</strong> {brewery.name}</p>
                    {brewery.location && <p><strong>Location:</strong> {brewery.location}</p>}
                </div>
            )}
        </div>
    );
};

export default BeerDetails;