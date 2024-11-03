import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BarDetailsScreen = ({ route }) => {
  const { barId } = route.params; // ID del evento asociado al bar
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${API}:${PORT}/api/v1/bars/${barId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setBar(data.bar);
        console.log(data.bar);
      } catch (error) {
        console.error('Error fetching bar details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarDetails();
  }, [barId]);

  const handleCheckIn = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');

      const response = await fetch(`http://${API}:${PORT}/api/v1/events/${barId}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: 71, // Agrega aquí el ID de usuario de prueba o extrae del token como antes
          checked_in: true,
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

      {/* Botón de check-in */}
      <Button title="Check-in" onPress={handleCheckIn} />
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
});

export default BarDetailsScreen;