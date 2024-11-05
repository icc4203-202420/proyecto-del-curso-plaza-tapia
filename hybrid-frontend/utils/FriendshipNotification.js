import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Button } from 'react-native';

const FriendshipNotification = () => {
    const [requests, setRequests] = useState([]);

    const fetchFriendshipRequests = async () => {
        try {
            const response = await fetch('http://YOUR_API_URL/api/v1/friendship_requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega aquí cualquier encabezado de autenticación si es necesario
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data.friendship_requests);
                if (data.friendship_requests.length > 0) {
                    Alert.alert("Nuevas Solicitudes de Amistad", `Tienes ${data.friendship_requests.length} nuevas solicitudes de amistad.`);
                }
            } else {
                console.error('Error fetching friendship requests:', data.error);
            }
        } catch (error) {
            console.error('Error fetching friendship requests:', error);
        }
    };

    useEffect(() => {
        fetchFriendshipRequests();
        const interval = setInterval(fetchFriendshipRequests, 10000); // Verifica cada 10 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <Text>Solicitudes de amistad: {requests.length}</Text>
            {requests.map(request => (
                <View key={request.id}>
                    <Text>Solicitud de: {request.sender_handle}</Text>
                </View>
            ))}
        </View>
    );
};

export default FriendshipNotification;