import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';

// Estado inicial para el reducer
const initialState = {
    loading: true,
    error: null,
    users: [],
};

// Función reductora
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const UsersScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [query, setQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try {
                const token = await AsyncStorage.getItem('jwt');
                const response = await fetch(`http://${API}:${PORT}/api/v1/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.users });
                    setFilteredUsers(data.users); // Inicializa el estado de usuarios filtrados
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load users' });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load users' });
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (query === '') {
            setFilteredUsers(state.users);
        } else {
            const filtered = state.users.filter((user) =>
                user.handle.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [query, state.users]);

    const { loading, error } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading users...</Text>
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
            <Text style={styles.title}>Search for Users</Text>
            <TextInput
                style={styles.input}
                placeholder="Type user handle"
                value={query}
                onChangeText={setQuery}
            />
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('User', { userId: item.id })}>
                        <View style={styles.userContainer}>
                            <Text style={styles.userName}>{item.handle}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noUsersText}>No users availables</Text>}
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
    userContainer: {
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
    userName: {
        fontSize: 16,
        color: '#333',
    },
    noUsersText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UsersScreen;
