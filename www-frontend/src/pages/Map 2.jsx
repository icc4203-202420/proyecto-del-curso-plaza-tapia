import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios'; // Para realizar la solicitud a la API de Google Places

const apiKey = 'AIzaSyDUeMhptEtQgYFHh3H7FyFs0ksbE-UoShs'

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapWithBarsSearch = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [bars, setBars] = useState([]); // Estado para los bares encontrados
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef(null); // Referencia al mapa para acceder a sus métodos

  // Obtener la ubicación del usuario (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setCenter({ lat: -34.6037, lng: -58.3816 }); // Establecer un valor predeterminado (ej. Buenos Aires)
        }
      );
    }
  }, []);

  // Función para buscar bares usando la API de Google Places
  const searchBars = async () => {
    const { lat, lng } = center;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=bar&keyword=${searchTerm}&key=${apiKey}`
      );

      setBars(response.data.results); // Actualiza el estado con los bares encontrados
    } catch (error) {
      console.error('Error fetching bars:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchBars();
  };

  return (
    <div>
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for bars"
          style={{ padding: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Search</button>
      </form>

      {/* Cargar el mapa de Google */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map; // Guarda referencia al mapa
          }}
        >
          {/* Mostrar los bares como marcadores en el mapa */}
          {bars.map((bar, index) => (
            <Marker
              key={index}
              position={{
                lat: bar.geometry.location.lat,
                lng: bar.geometry.location.lng,
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
