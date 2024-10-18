import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ReviewScreen = ({ route }) => {
    const { beerId } = route.params;

    return (
        <View style={styles.container}>
            <Text>Review for Beer ID: {beerId}</Text>
            {/* Aquí puedes agregar el formulario para hacer la reseña */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReviewScreen;