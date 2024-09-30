import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapWithBarsSearch = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBars, setFilteredBars] = useState([]);
  const mapRef = useRef(null);

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
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:3001/api/v1/bars', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedBars = response.data.bars;
        setBars(fetchedBars);
        setFilteredBars(fetchedBars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBars(bars);
    } else {
      const filtered = bars.filter((bar) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const { address } = bar;
        return (
          bar.name.toLowerCase().includes(lowerSearchTerm) ||
          (address && (
            address.line1.toLowerCase().includes(lowerSearchTerm) ||
            address.line2.toLowerCase().includes(lowerSearchTerm) ||
            address.city.toLowerCase().includes(lowerSearchTerm) ||
            address.country.name.toLowerCase().includes(lowerSearchTerm)
          ))
        );
      });
      setFilteredBars(filtered);
    }
  }, [searchTerm, bars]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBarSelect = (bar) => {
    setCenter({ lat: bar.latitude, lng: bar.longitude });
    setSearchTerm(bar.name);
    setFilteredBars([bar]);

    if (mapRef.current) {
      mapRef.current.panTo({ lat: bar.latitude, lng: bar.longitude });
      mapRef.current.setZoom(15);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Evitar que se renderize/recargue la pagina al presionar enter

  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <form style={{ marginBottom: '20px' }} onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar bares o direcciones"
          style={{ padding: '10px', width: '300px' }}
        />
        {filteredBars.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', padding: '10px', listStyle: 'none' }}>
            {filteredBars.map((bar) => (
              <li
                key={bar.id}
                onClick={() => handleBarSelect(bar)}
                style={{ cursor: 'pointer', padding: '5px 0', color: 'black' }}
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
          center={center}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {filteredBars.map((bar, index) => (
            <Marker
              key={index}
              position={{
                lat: bar.latitude,
                lng: bar.longitude,
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