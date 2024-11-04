import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, Image, FlatList } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EventScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${API}:${PORT}/api/v1/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setEvent(data.event);
        setPhotos(data.photos || []); // Asume que el backend devuelve las fotos asociadas al evento
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleCheckIn = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await fetch(`http://${API}:${PORT}/api/v1/events/${eventId}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
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

  const handleSelectPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.error) {
        console.error('User cancelled image picker or there was an error.');
      } else {
        const photo = response.assets[0];
        handleUploadPhoto(photo);
      }
    });
  };

  const handleUploadPhoto = async (photo) => {
    const token = await AsyncStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('photo', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName,
    });

    try {
      const response = await fetch(`http://${API}:${PORT}/api/v1/events/${eventId}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Photo uploaded successfully!");
        const newPhoto = await response.json();
        setPhotos((prevPhotos) => [...prevPhotos, newPhoto]); // Actualiza la lista de fotos
      } else {
        Alert.alert("Error", "Failed to upload photo.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "An error occurred during photo upload.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Event Details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Event details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}>Date: {event.date}</Text>
      <Text style={styles.detail}>Location: {event.location}</Text>
      <Text style={styles.detail}>Description: {event.description}</Text>

      <Button title="Check-in" onPress={handleCheckIn} />
      <Button title="Upload Photo" onPress={handleSelectPhoto} />

      {/* Mostrar las fotos subidas */}
      <Text style={styles.sectionTitle}>Photos:</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.photo} />
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
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default EventScreen;