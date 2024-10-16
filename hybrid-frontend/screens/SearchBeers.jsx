import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const SearchBeers = () => {
    const [query, setQuery] = useState('');      // For the search input
    const [beers, setBeers] = useState([]);      // Full list of beers from backend
    const [filteredBeers, setFilteredBeers] = useState([]);  // Filtered list of beers

    useEffect(() => {
        // Fetch the list of beers when the component loads
        const fetchBeers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3000/api/v1/beers');
                console.log('API response:', response.data.beers);  // Debugging: log the data to confirm it's coming in
                setBeers(response.data.beers);
                setFilteredBeers(response.data.beers);  // Set the initial filtered beers to be all beers
            } catch (error) {
                console.error('Error fetching beers:', error);
            }
        };

        fetchBeers();
    }, []);

    // Filter the beers list based on the search query
    const handleSearch = (text) => {
        console.log('Search input:', text);  // Debugging: check the input text
        setQuery(text);

        if (text === '') {
            // If the search input is empty, show all beers
            setFilteredBeers(beers);
        } else {
            // Otherwise, filter the beers by name
            const filtered = beers.filter((beer) =>
                beer.name.toLowerCase().includes(text.toLowerCase())
            );
            console.log('Filtered beers:', filtered);  // Debugging: log the filtered list
            setFilteredBeers(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search for Beers</Text>

            {/* Search bar */}
            <TextInput
                style={styles.input}
                placeholder="Type beer name"
                value={query}
                onChangeText={handleSearch}  // Trigger handleSearch on input change
            />

            {/* Display the list of filtered beers */}
            <FlatList
                data={filteredBeers}
                keyExtractor={(item) => item.id.toString()} // Assuming each beer has a unique 'id'
                renderItem={({ item }) => (
                    <View style={styles.beerItem}>
                        <Text style={styles.beerName}>{item.name}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
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
    beerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    beerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SearchBeers;