import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';

// Estado inicial para el reducer
const initialState = {
    loading: true,
    error: null,
    reviews: [],
};

// Función reductora
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, reviews: action.payload, error: null };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ReviewsScreen = ({ route }) => {
    const { beerId } = route.params;

    // useReducer para manejar el estado de carga, error y reseñas
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchReviews = async () => {
            dispatch({ type: 'FETCH_INIT' });  // Inicia la carga

            try {
                const token = await AsyncStorage.getItem('jwt');
                const response = await fetch(`http://${API}:${PORT}/api/v1/beers/${beerId}/reviews`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data.reviews });  // Carga exitosa
                } else {
                    dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load reviews' });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load reviews' });
            }
        };

        fetchReviews();
    }, [beerId]);

    const { loading, error, reviews } = state;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Cargando reseñas...</Text>
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
        <ScrollView style={styles.container}>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <View key={review.id} style={styles.reviewContainer}>
                        <Text style={styles.reviewText}>{review.text}</Text>
                        <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noReviewsText}>No hay reseñas disponibles para esta cerveza.</Text>
            )}
        </ScrollView>
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
    reviewContainer: {
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
    reviewText: {
        fontSize: 16,
        color: '#333',
    },
    reviewRating: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    noReviewsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ReviewsScreen;