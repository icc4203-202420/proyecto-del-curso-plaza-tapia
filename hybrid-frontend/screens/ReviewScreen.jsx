import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { Slider } from '@rneui/themed';  // Importar Slider desde @rneui/themed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';

const ReviewScreen = ({ route, navigation }) => {
    const { beerId } = route.params;

    // Estados para la reseña y el rating
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);  // Inicializa el rating en 1

    // Función para enviar la reseña al backend
    const handleSubmitReview = async () => {
        if (reviewText.length < 15) {
            Alert.alert('Error', 'The review must be at least 15 characters long.');
            return;
        }


        const reviewData = {
            review: {
                text: reviewText,
                rating: rating,
                beer_id: beerId,
            },
        };

        try {

            const token = await AsyncStorage.getItem('jwt');
            const response = await fetch(`http://${API}:${PORT}/api/v1/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Review submitted successfully');
                // Navega de vuelta a otra pantalla si es necesario
                navigation.goBack();
            } else {
                Alert.alert('Error', `Failed to submit review: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit review');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Review for Beer ID: {beerId}</Text>

            {/* Caja de texto para la reseña */}
            <TextInput
                style={styles.input}
                placeholder="Write your review here"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
            />

            {/* Slider para el rating */}
            <Text style={styles.subHeader}>Rate this beer: {rating.toFixed(1)}</Text>
            <Slider
                value={rating}
                onValueChange={setRating}  // Actualiza el estado con el valor del slider
                minimumValue={1}  // Valor mínimo
                maximumValue={5}  // Valor máximo
                thumbTintColor="#1462DB"  // Color del 'thumb' (dorado)
                minimumTrackTintColor="#1462DB"  // Color de la pista izquierda
                maximumTrackTintColor="#ccc"  // Color de la pista derecha
                style={styles.slider}  // Estilo del slider
            />


            {/* Botón para enviar la reseña */}
            <Button title="Submit Review" onPress={handleSubmitReview} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '100%',
        height: 100,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    subHeader: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ReviewScreen;