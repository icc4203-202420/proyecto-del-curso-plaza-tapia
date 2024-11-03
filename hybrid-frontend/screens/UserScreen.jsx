import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';

const initialState = {
    loading: true,
    user: null,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { loading: false, user: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

const UserScreen = ({ route }) => {
    const { userId } = route.params; // Obtener el ID del usuario desde los parámetros de navegación
    const [state, dispatch] = useReducer(reducer, initialState);
    const [friendRequestSent, setFriendRequestSent] = useState(false); // Estado para la solicitud de amistad

    useEffect(() => {
        const fetchUserDetails = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try {
                const token = await AsyncStorage.getItem('jwt');
                const response = await fetch(`http://${API}:${PORT}/api/v1/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.user });
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load user details' });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load user details' });
            }
        };

        fetchUserDetails();

        return () => dispatch({ type: 'FETCH_INIT' });
    }, [userId]);

    const handleSendFriendRequest = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            const response = await fetch(`http://${API}:${PORT}/api/v1/friendship_requests`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientId: userId }), // Asegúrate de que esto coincida con tu API
            });

            if (response.ok) {
                Alert.alert('Success', 'Friend request sent successfully');
                setFriendRequestSent(true); // Cambiar el estado para reflejar que se envió la solicitud
            } else {
                Alert.alert('Error', 'Failed to send friend request');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while sending the friend request');
        }
    };

    const { loading, user, error } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading user information...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.userName}>{user.handle}</Text>
            {friendRequestSent ? (
                <Text style={styles.friendRequestText}>Friend request sent!</Text>
            ) : (
                <TouchableOpacity style={styles.friendRequestButton} onPress={handleSendFriendRequest}>
                    <Text style={styles.friendRequestButtonText}>Send Friend Request</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.sectionTitle}>Reviews</Text>
            {user.reviews.length === 0 ? (
                <Text style={styles.noReviewsText}>No reviews made by this user</Text>
            ) : (
                <FlatList
                    data={user.reviews}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.reviewContainer}>
                            <Text style={styles.reviewText}>{item.text}</Text>
                            <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
                        </View>
                    )}
                />
            )}
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
        backgroundColor: '#F5F5F5',
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
        backgroundColor: '#F5F5F5',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        textAlign: 'left',
    },
    noReviewsText: {
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center',
    },
    reviewContainer: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    reviewText: {
        fontSize: 16,
        color: '#333',
    },
    reviewRating: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    friendRequestText: {
        fontSize: 16,
        color: '#28A745',
        marginTop: 10,
        textAlign: 'center',
    },
    friendRequestButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    friendRequestButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserScreen;
