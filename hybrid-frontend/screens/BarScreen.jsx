import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownMenu from '../utils/DropdownMenu';

const BarScreen = ({ route, navigation }) => {
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);

  useEffect(() => {
    const fetchBarDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');

        // Obtener detalles del bar
        const barResponse = await fetch(`http://${api}:${port}/api/v1/bars/${barId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const barData = await barResponse.json();
        setBar(barData.bar);

        // Obtener eventos asociados al bar
        const eventsResponse = await fetch(`http://${api}:${port}/api/v1/bars/${barId}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error fetching bar or events details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarDetails();
  }, [barId]);

  if (loading) {
    return (
      <>
        <DropdownMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6347" />
          <Text style={styles.loadingText}>Loading Bar Details...</Text>
        </View>
      </>
    );
  }

  if (!bar) {
    return (
      <>
        <DropdownMenu />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Bar details not found.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <DropdownMenu />
      <View style={styles.container}>
        <View style={styles.barHeader}>
          <Text style={styles.barName}>{bar.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>📍 {bar.country}, {bar.city}, {bar.line1}</Text>
        </View>

        <Text style={styles.sectionTitle}>Events</Text>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            // Separar la fecha y la hora
            const [eventDate, eventTime] = item.date.split("T"); // Separa la fecha y la hora

            // Convertir la hora a formato de 12 horas (AM/PM)
            const [hour, minute] = eventTime.split(":");
            const hour12 = hour % 12 || 12; // Convertir a formato de 12 horas
            const ampm = hour >= 12 ? "PM" : "AM"; // Determinar AM/PM
            const formattedTime = `${hour12}:${minute} ${ampm}`;

            return (
              <TouchableOpacity
                style={styles.eventContainer}
                onPress={() => navigation.navigate('Event', { eventId: item.id })}
              >
                <Text style={styles.eventTitle}>{item.name}</Text>
                <Text style={styles.eventDetail}>
                  <Text style={styles.eventIcon}> 📅</Text> {eventDate}
                </Text>
                <Text style={styles.eventDetail}>
                  <Text style={styles.timeIcon}> ⏰</Text> {formattedTime}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.noEventsText}>No events available</Text>}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  barHeader: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0', // Fondo gris claro
    justifyContent: 'center',
    alignItems: 'center',
  },
  barName: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: -30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  eventContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetail: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  eventIcon: {
    fontSize: 18,
    color: '#ff6347', // Color destacado para el icono de la fecha
    marginRight: 5,
  },
  timeIcon: {
    fontSize: 18,
    color: '#ff9800', // Diferente color para el icono de la hora
    marginRight: 5,
  },
});

export default BarScreen;
