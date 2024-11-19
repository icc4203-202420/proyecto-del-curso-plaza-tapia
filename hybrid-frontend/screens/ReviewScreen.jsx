import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider'; // Correct Import
import { API, PORT } from '@env';

const ReviewScreen = ({ route, navigation }) => {
    const { beerId } = route.params;
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [api, setAPI] = useState(API);
    const [port, setPORT] = useState(PORT);

    const handleSubmitReview = async () => {
        if (reviewText.length < 15) {
            Alert.alert('Error', 'The review must be at least 15 characters long.');
            return;
        }

        const formattedRating = Math.round(rating * 10) / 10;

        const reviewData = {
            review: {
                text: reviewText,
                rating: formattedRating,
                beer_id: beerId,
            },
        };

        try {
            const token = await AsyncStorage.getItem('jwt');
            const response = await fetch(`http://${api}:${port}/api/v1/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Review submitted successfully');
                navigation.goBack({ refresh: true });
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
            
            <TextInput
                style={styles.input}
                placeholder="Write your review here"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit
            />

            <Text style={styles.subHeader}>Rate this beer: {rating.toFixed(1)}</Text>

            <Slider
                style={styles.slider} // Apply explicit styling
                value={rating}
                onValueChange={(value) => {
                    const roundedValue = Math.round(value * 10) / 10;
                    setRating(roundedValue);
                }}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                minimumTrackTintColor="#1462DB"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1462DB"
            />

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