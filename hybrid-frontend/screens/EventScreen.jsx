import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, Image, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure the package is installed
import { API, PORT } from '@env';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import DropdownMenu from '../utils/DropdownMenu';

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
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {

    const formatDateTime = (dateTime) => {
      const [date, time] = dateTime.split('T'); // Separate date and time
      const [hour, minute] = time.split(':'); // Extract hour and minute
      const hour12 = hour % 12 || 12; // Convert to 12-hour format
      const ampm = hour >= 12 ? 'PM' : 'AM'; // Determine AM/PM
      const formattedTime = `${hour12}:${minute} ${ampm}`; // Format time
      return { date, time: formattedTime };
    };

    const fetchEventDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        console.log(data);
        setEvent(data.event);
        console.log(event);
        setPhotos(data.photos || []);
        setName(data.event.name);
        setDescription(data.event.description);
        const { date, time } = formatDateTime(data.event.date);
        setDate(date);
        setTime(time);
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
      <>
        <View style={styles.container1}>
            <DropdownMenu />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text>Loading Event Details...</Text>
        </View>
      </>  
    );
  }

  return (
    <>
      <View style={styles.container1}>
          <DropdownMenu />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.detail}>Date: {date}</Text>
        <Text style={styles.detail}>Time: {time}</Text>
        <Text style={styles.detail}>Description: {description}</Text>

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
    </>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detail: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#black',
    marginVertical: 15,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taggedUsers: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  pickerContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addFriendText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  friendText: {
    fontSize: 16,
    color: '#007BFF',
    marginVertical: 5,
  },
  checkInButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventScreen;