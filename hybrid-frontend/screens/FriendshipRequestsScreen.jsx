import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';
import { jwtDecode } from 'jwt-decode';

const handleAccept = async (requestId, fetchRequests) => {
    try {
        const [api, setAPI] = useState(API);
        const [port, setPORT] = useState(PORT);
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/friendship_requests/${requestId}/accept`, {
            method: 'POST',  // Cambia a POST si la ruta está definida como un POST
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            fetchRequests(); // Re-fetch friendship requests after acceptance
        } else {
            console.error('Failed to accept request');
        }
    } catch (error) {
        console.error('Error accepting request:', error);
    }
};


const handleReject = async (requestId, fetchRequests) => {
    try {
        const [api, setAPI] = useState(API);
        const [port, setPORT] = useState(PORT);
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/friendship_requests/${requestId}/reject`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            fetchRequests(); // Re-fetch friendship requests after rejection
        } else {
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

    const fetchRequests = async () => {
        dispatch({ type: 'FETCH_INIT' });

        try {
            const [api, setAPI] = useState(API);
            const [port, setPORT] = useState(PORT);
            const token = await AsyncStorage.getItem('jwt');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.user_id;
            const response = await fetch(`http://${api}:${port}/api/v1/friendship_requests?user_id=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'FETCH_SUCCESS', payload: data.friendship_requests });
            } else {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friendship requests' });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friendship requests' });
        }
    };

    useEffect(() => {
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
                    <View style={styles.requestContainer}>
                        <Text style={styles.requestText}>{item.sender_handle}</Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Accept"
                                onPress={() => handleAccept(item.id, fetchRequests)}
                                color="#28a745"
                            />
                            <Button
                                title="Reject"
                                onPress={() => handleReject(item.id, fetchRequests)}
                                color="#dc3545"
                            />
                        </View>
                    </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    noRequestsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FriendshipRequestsScreen;
