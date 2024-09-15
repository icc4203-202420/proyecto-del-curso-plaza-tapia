import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '400px',
};
console.log('Google Maps API Key:', apiKey);
const MapWithBarsSearch = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBars, setFilteredBars] = useState([]);
  const mapRef = useRef(null);

  // Get user location (GPS) or fallback to default location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setCenter({ lat: -34.6037, lng: -58.3816 }); // Default to Buenos Aires if geolocation fails
        }
      );
    }

    const fetchBars = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        const fetchedBars = response.data.bars;
        setBars(fetchedBars);
        setFilteredBars(fetchedBars); // Show all bars initially
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  // Filter bars by search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBars(bars); // Show all bars if the search term is empty
    } else {
      const filtered = bars.filter((bar) =>
        bar.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBars(filtered);
    }
  }, [searchTerm, bars]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBarSelect = (bar) => {
    setCenter({ lat: bar.latitude, lng: bar.longitude });
    setSearchTerm(bar.name);
    setFilteredBars([bar]); // Only show the selected bar after selection

    if (mapRef.current) {
      mapRef.current.panTo({ lat: bar.latitude, lng: bar.longitude });
      mapRef.current.setZoom(15); // Reset the zoom to 15 when selecting a bar
    }
  };

  return (
    <div style={{ paddingTop: '80px' }}> {/* Added padding to ensure the search bar is not covered by the top bar */}
      <form style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for bars"
          style={{ padding: '10px', width: '300px' }}
        />
        {/* Suggestions list */}
        {filteredBars.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', padding: '10px', listStyle: 'none' }}>
            {filteredBars.map((bar) => (
              <li
                key={bar.id}
                onClick={() => handleBarSelect(bar)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {bar.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center} // Ensure the map is centered
          zoom={13} // Adjust zoom level if necessary
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* Marker for the user's current location */}
          {center.lat !== 0 && (
            <Marker position={center} title="You are here" />
          )}

          {/* Bar markers with correct latitude and longitude */}
          {bars.map((bar, index) => (
            <Marker
              key={index}
              position={{
                lat: bar.latitude, // Use bar.latitude from your API
                lng: bar.longitude, // Use bar.longitude from your API
              }}
              title={bar.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapWithBarsSearch;