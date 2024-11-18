import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, Image, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure the package is installed
import { API, PORT } from '@env';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EventScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [friends, setFriends] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setEvent(data.event);
        setPhotos(data.photos || []);
        console.log('data.photos:', data.photos);
        data.photos.forEach((photo, index) => {
          console.log(`Photo ${index + 1} tagged_users:`, photo.tagged_users);
        });
        console.log('Token:', token)
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        const response = await fetch(`http://${api}:${port}/api/v1/users/${userId}/friendships`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchEventDetails();
    fetchFriends();
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photo = result.assets[0];
      setSelectedPhoto(photo);
    } else {
      console.log("User cancelled image picker or there was an error.");
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedPhoto) {
      Alert.alert("Error", "Please select a photo first.");
      return;
    }

    const token = await AsyncStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('event_picture[photo]', {
      uri: selectedPhoto.uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('event_picture[tagged_users]', JSON.stringify(taggedUsers));

    console.log("Uploading photo with the following data:");
    console.log("Photo URI:", selectedPhoto.uri);
    console.log("Tagged Users (JSON):", JSON.stringify(taggedUsers));
    console.log("FormData contents:", Array.from(formData.entries()));

    setIsUploading(true);
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
        setTaggedUsers([]);
        setSelectedPhoto(null);
      } else {
        Alert.alert("Error", "Failed to upload photo.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "An error occurred during photo upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTaggedUser = () => {
    if (selectedFriend && !taggedUsers.includes(Number(selectedFriend))) {
      setTaggedUsers((prev) => [...prev, Number(selectedFriend)]); // Ensure the ID is stored as an integer
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}>Date: {event.date}</Text>
      <Text style={styles.detail}>Location: {event.location}</Text>
      <Text style={styles.detail}>Description: {event.description}</Text>

      <Button title="Check-in" onPress={handleCheckIn} />
      <Button title="Select Photo" onPress={handleSelectPhoto} />

      {selectedPhoto && (
        <View>
          <Text style={styles.sectionTitle}>Add Tagged Friends:</Text>
          <Picker
        selectedValue={selectedFriend}
        onValueChange={(itemValue) => setSelectedFriend(itemValue)}
      >
        <Picker.Item label="Select a Friend" value={null} />
        {friends.map((friend) => (
          <Picker.Item
            key={friend.id}
            label={`${friend.first_name} ${friend.last_name}`}
            value={friend.id}
          />
        ))}
      </Picker>
          <Button title="Add Friend" onPress={handleAddTaggedUser} />
          <Text style={styles.sectionTitle}>Tagged Users:</Text>
          {taggedUsers.map((id) => {
            const friend = friends.find((f) => f.id === Number(id)); // Convert to number for comparison
            return (
              <Text key={id}>
                {friend ? `${friend.first_name} ${friend.last_name}` : "Unknown User"}
              </Text>
            );
          })}
          <Button
            title="Upload Photo"
            onPress={handleUploadPhoto}
            disabled={isUploading}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Photos:</Text>
      <FlatList
      data={photos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Image source={{ uri: item.url }} style={styles.photo} />
          {item.tagged_users && item.tagged_users.length > 0 && (
            <Text style={styles.taggedUsers}>
              Tagged: {item.tagged_users
                .map((id) => {
                  const friend = friends.find((f) => f.id === id); // Find the friend by ID
                  return friend ? `${friend.first_name} ${friend.last_name}` : "Unknown User"; // Format name or show 'Unknown User'
                })
                .join(", ")} {/* Join names with commas */}
            </Text>
          )}
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  taggedUsers: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default EventScreen;