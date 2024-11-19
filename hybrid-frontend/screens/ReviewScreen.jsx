import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider'; // Use community slider for better compatibility
import { API, PORT } from '@env';

const ReviewScreen = ({ route, navigation }) => {
    const { beerId, beerName } = route.params;
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [api, setAPI] = useState(API);
    const [port, setPORT] = useState(PORT);

    console.log(`API: ${api}, PORT: ${port}`);

    const handleSubmitReview = async () => {
        if (reviewText.length < 15) {
            Alert.alert('Error', 'The review must be at least 15 characters long.');
            return;
        }
        const reviewData = {
            review: {
                text: reviewText,
                rating: parseFloat(rating.toFixed(1)), // Ensure rating is rounded to one decimal place
                beer_id: beerId,
            },
        };

        try {
            const token = await AsyncStorage.getItem('jwt');
            const response = await fetch(`http://${api}:${port}/api/v1/reviews`, {
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
            <Text style={styles.title}>Review for {beerName}</Text>
            {/* Text input for review */}
            <TextInput
                style={styles.input}
                placeholder="Write your review here"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
            />

            {/* Slider for rating */}
            <Text style={styles.subHeader}>Rate this beer: {rating.toFixed(1)}</Text>
            <Slider
                value={rating}
                onValueChange={setRating}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                thumbTintColor="#1462DB"
                minimumTrackTintColor="#1462DB"
                maximumTrackTintColor="#ccc"
                style={styles.slider}
            />

            {/* Button to submit review */}
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