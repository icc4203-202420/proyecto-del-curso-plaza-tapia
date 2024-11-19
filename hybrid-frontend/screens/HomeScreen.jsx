import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownMenu from '../utils/DropdownMenu';
import { API, PORT } from '@env';

const HomeScreen = ({ navigation }) => {

    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [refreshing, setRefreshing] = useState(false); 
    const [api, setAPI] = useState(API); 
    const [port, setPORT] = useState(PORT); 

    const fetchPosts = async () => {
        setLoading(true);
        try {
        
        const token = await AsyncStorage.getItem('jwt');
        if (!token) {
            Alert.alert('Error', 'Authentication token not found.');
            return;
        }

        const reviewsResponse = await fetch(`http://${api}:${port}/api/v1/friends_reviews`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            },
        });
        const reviewsResult = await reviewsResponse.json();
        var sortedReviews = [];
        if (reviewsResponse.ok) {
            sortedReviews = reviewsResult.reviews
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((review) => ({ ...review, type: 0 })); // Add a "type" to identify reviews
        }

        const photosResponse = await fetch(`http://${api}:${port}/api/v1/friends_photos`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            },
        });
        const photosResult = await photosResponse.json();
        var sortedPhotos = [];
        if (photosResponse.ok) {
            sortedPhotos = photosResult.photos
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((photo) => ({ ...photo, type: 1 }));
        }

        const attendancesResponse = await fetch(`http://${api}:${port}/api/v1/friends_attendances`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            },
        });
        const attendancesResult = await attendancesResponse.json();
        console.log("attendancesResponse: ", attendancesResponse);
        console.log("attendanceResult: ", attendancesResult);
        var sortedAttendances = [];
        if (attendancesResponse.ok) {
            sortedAttendances = attendancesResult.attendances
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((attendance) => ({ ...attendance, type: 2 }));
        }
        else {
            console.log("attendanceResponse.ok", attendancesResponse.ok);
        }
        console.log("sortedAttendances: ", sortedAttendances);

        const combinedData = [...sortedReviews, ...sortedPhotos, ...sortedAttendances].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setPosts(combinedData);

        } catch (error) {
        console.error('Error obtaining posts:', error);
        } finally {
        setLoading(false); 
        }
    };

    const handleRefresh = () => {
        setRefreshing(true); 
        fetchPosts(); 
        setRefreshing(false); 
    };

    useEffect(() => {
        fetchPosts(); 
    }, []); 

    return (
        <>
            <View style={styles.container1}>
                <DropdownMenu />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Feed</Text>
                <FlatList
                data={posts} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({ item }) => {
                    if (item.type === 0) {
                    return (
                        <TouchableOpacity
                        style={styles.post}
                        onPress={() => navigation.navigate('Beer', { beerId: item.beer_id })}
                        >
                        <View style={styles.post}>
                            <Text style={styles.postText}>Beer: {item.beer_name}</Text>
                            <Text style={styles.postText}>Review: {item.text}</Text>
                            <Text style={styles.postText}>Rating: {item.rating}</Text>
                            <Text style={styles.postText}>By: {item.handle}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                    }
                    else if (item.type === 1) {
                    return (
                        <TouchableOpacity
                        style={styles.post}
                        onPress={() => navigation.navigate('Event', { eventId: item.event_id })}
                        >
                        <View style={styles.post}>
                            <Text style={styles.postText}>Event: {item.event_name}</Text>
                            <Text style={styles.postText}>Bar: {item.bar}</Text>
                            <Text style={styles.postText}>By: {item.handle}</Text>
                            <Image source={{ uri: item.url }} style={styles.image} />
                        </View>
                        </TouchableOpacity>
                    );
                    }
                    else if (item.type === 2) {
                    return (
                        <TouchableOpacity
                        style={styles.post}
                        onPress={() => navigation.navigate('Event', { eventId: item.event_id })}
                        >
                        <View style={styles.post}>
                            <Text style={styles.postText}>{item.handle} confirmed attendance to {item.event_name}</Text>
                            <Text style={styles.postText}>Bar: {item.bar}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                    }
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No posts.</Text>}
                refreshing={refreshing} 
                onRefresh={handleRefresh} 
                />
            </View>
        </>
    );
    };

const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: 200,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 10,
    },
    container1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3f3f3',
      maxHeight: 0,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      height: '7%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    post: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
    },
    postText: {
      fontSize: 16,
      color: '#333',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#555',
    },
    emptyText: {
      fontSize: 16,
      color: '#777',
      textAlign: 'center',
      marginTop: 20,
    },
  });

export default HomeScreen;
