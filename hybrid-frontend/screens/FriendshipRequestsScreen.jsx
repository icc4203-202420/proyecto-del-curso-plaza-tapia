import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';
import { jwtDecode } from 'jwt-decode';

const handleAccept = async (requestId) => {
    try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${API}:${PORT}/api/v1/friendship_requests/${requestId}/accept`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Refresh the requests list or remove the accepted request from the UI
            fetchRequests(); // Re-fetch friendship requests after acceptance
        } else {
            // Handle the error
            console.error('Failed to accept request');
        }
    } catch (error) {
        console.error('Error accepting request:', error);
    }
};

const handleReject = async (requestId) => {
    try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${API}:${PORT}/api/v1/friendship_requests/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Refresh the requests list or remove the rejected request from the UI
            fetchRequests(); // Re-fetch friendship requests after rejection
        } else {
            // Handle the error
            console.error('Failed to reject request');
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
    }
};

// Estado inicial para el reducer
const initialState = {
    loading: true,
    error: null,
    requests: [],
};

// Función reductora
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, requests: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const FriendshipRequestsScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchRequests = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try {
                const token = await AsyncStorage.getItem('jwt');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.user_id;
                const response = await fetch(`http://${API}:${PORT}/api/v1/users/${userId}/friendship_requests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.requests });
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friendship requests' });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friendship requests' });
            }
        };

        fetchRequests();
    }, []);

    const { loading, error, requests } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading requests...</Text>
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
            <Text style={styles.title}>Friendship Requests</Text>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {/* Aquí puedes manejar la aceptación o el rechazo */}}>
                        <View style={styles.requestContainer}>
                            <Text style={styles.requestText}>{item.sender_handle}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noRequestsText}>No friendship requests available</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    requestContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    requestText: {
        fontSize: 16,
        color: '#333',
    },
    noRequestsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FriendshipRequestsScreen;
