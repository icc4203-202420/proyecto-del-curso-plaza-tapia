import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { API, PORT } from '@env';
import { jwtDecode } from "jwt-decode";

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

const ProfileScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserDetails = async () => {
            dispatch({ type: 'FETCH_INIT' });

            try {
                const token = await AsyncStorage.getItem('jwt');
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken);
                const userId = decodedToken.user_id;
                const response = await fetch(`http://${API}:${PORT}/api/v1/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                console.log('Response:', data);

                dispatch({ type: 'FETCH_SUCCESS', payload: data.user });

            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load user details' });
            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await AsyncStorage.removeItem('jwt');
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Login' }]
                            })
                        );
                    }
                }
            ]
        );
    };

    const { loading, user, error } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
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
            <Text style={styles.title}>User Profile</Text>
            {user && (
                <>
                    <Text style={styles.infoText}>Name: {user.first_name} {user.last_name}</Text>
                    <Text style={styles.infoText}>Email: {user.email}</Text>
                    <Text style={styles.infoText}>Age: {user.age}</Text>
                    {/* <Text style={styles.infoText}>Address: {user.address.line1}, {user.address.city}, {user.address.country}</Text> */}
                </>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    logoutButton: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#ff4d4d',
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
