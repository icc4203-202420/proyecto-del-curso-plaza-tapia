import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, FlatList } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BarScreen = ({ route }) => {
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]); // Estado para los eventos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');

        // Obtener detalles del bar
        const barResponse = await fetch(`http://${API}:${PORT}/api/v1/bars/${barId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const barData = await barResponse.json();
        setBar(barData.bar);

        // Obtener eventos asociados al bar
        const eventsResponse = await fetch(`http://${API}:${PORT}/api/v1/bars/${barId}/events`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events); // Guardar eventos en el estado

      } catch (error) {
        console.error('Error fetching bar or events details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarDetails();
  }, [barId]);

  const handleCheckIn = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      
      // Realiza la solicitud de check-in directamente
      const response = await fetch(`http://${API}:${PORT}/api/v1/events/${eventId}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          checked_in: true,  // Envia solo el estado de check-in
        }),
      });
  
      if (response.ok) {
        Alert.alert("Success", "Check-in successful!");
      } else {
        const result = await response.json();
        Alert.alert("Error", result.error || "Failed to check-in.");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      Alert.alert("Error", "An error occurred during check-in.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Bar Details...</Text>
      </View>
    );
  }

  if (!bar) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Bar details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bar.name}</Text>
      <Text style={styles.detail}>Phone: {bar.phone}</Text>
      <Text style={styles.detail}>Rating: {bar.rating ? bar.rating : 'Not rated'}</Text>

      {/* Lista de eventos asociados al bar */}
      <Text style={styles.sectionTitle}>Events at {bar.name}:</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDetail}>Date: {item.date}</Text>
            <Button title="Check-in" onPress={() => handleCheckIn(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  eventContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventDetail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
});

export default BarScreen;