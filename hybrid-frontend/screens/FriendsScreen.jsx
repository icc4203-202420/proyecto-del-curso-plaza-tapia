import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';
import { jwtDecode } from "jwt-decode";

// Estado inicial para el reducer
const initialState = {
    loading: true,
    error: null,
    friends: [], // Asegúrate de que friends esté definido como un array vacío
};

// Función reductora
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, friends: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const FriendsScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [query, setQuery] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try {
                const token = await AsyncStorage.getItem('jwt');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.user_id;
                const response = await fetch(`http://${API}:${PORT}/api/v1/users/${userId}/friendships`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.friendships });
                    setFilteredFriends(data.friendships); // Inicializa el estado de amistades filtradas
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friends' });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load friends' });
            }
        };

        fetchFriends();
    }, []);

    useEffect(() => {
        // Solo intentamos acceder a length si state.friends está definido
        if (Array.isArray(state.friends)) {
            if (query === '') {
                setFilteredFriends(state.friends);
            } else {
                const filtered = state.friends.filter((friend) =>
                    friend.handle.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredFriends(filtered);
            }
        } else {
            setFilteredFriends([]); // Si no hay amigos, mantenemos la lista vacía
        }
    }, [query, state.friends]);

    const { loading, error } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading friends...</Text>
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
            <Text style={styles.title}>Search for Friends</Text>
            <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('FriendshipRequests')}>
                <Text style={styles.requestButtonText}>View Friendship Requests</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Type friend's handle"
                value={query}
                onChangeText={setQuery}
            />
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('User', { userId: item.id })}>
                        <View style={styles.friendContainer}>
                            <Text style={styles.friendName}>{item.handle}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noFriendsText}>No friends available</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    friendContainer: {
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
    friendName: {
        fontSize: 16,
        color: '#333',
    },
    noFriendsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
    requestButton: {
        backgroundColor: '#007BFF', // Color de fondo
        paddingVertical: 10, // Espaciado vertical
        paddingHorizontal: 20, // Espaciado horizontal
        borderRadius: 5, // Bordes redondeados
        alignItems: 'center', // Centrar contenido
        marginBottom: 10, // Espaciado inferior
    },
    requestButtonText: {
        color: '#FFFFFF', // Color del texto
        fontSize: 16, // Tamaño del texto
        fontWeight: 'bold', // Negrita
    },
});

export default FriendsScreen;
