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
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);
  console.log(`API: ${api}, PORT: ${port}`);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setEvent(data.event);
        setPhotos(data.photos || []); // Supone que el backend devuelve las fotos asociadas al evento

        console.log("Photos data:", data.photos);
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
      const response = await fetch(`http://${api}:${port}/api/v1/events/${eventId}/attendances`, {
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

  const handleSelectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Verifica la estructura del resultado
    console.log("ImagePicker Result:", result);

    // Asegúrate de que la imagen se seleccionó correctamente y tiene un URI
    if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0]; // Accedemos a la primera imagen seleccionada
        handleUploadPhoto(photo);
    } else {
        console.log("User cancelled image picker or there was an error.");
    }
  };

  const handleUploadPhoto = async (photo) => {
    const token = await AsyncStorage.getItem('jwt');

    console.log("Photo URI:", photo.uri);
    console.log("Photo Type:", 'image/jpeg');
    console.log("Photo Name:", 'photo.jpg');


    const formData = new FormData();
    formData.append('event_picture[photo]', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await fetch(`http://${api}:${port}/api/v1/events/${eventId}/photos`, {
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
        setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
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
    borderWidth: 1,        // Agrega un borde
    borderColor: '#ccc',   // Color del borde
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default EventScreen;