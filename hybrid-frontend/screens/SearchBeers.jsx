import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SearchBeers = () => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', query);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search for Beers</Text>
            <TextInput
                style={styles.input}
                placeholder="Type beer name"
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Search" onPress={handleSearch} />
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
    title: {
        fontSize: 24,        // Larger font size
        fontWeight: 'bold',  // Bold text to emphasize the title
        textAlign: 'center', // Center the text
        marginBottom: 20,    // Adds some space below the title
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default SearchBeers;