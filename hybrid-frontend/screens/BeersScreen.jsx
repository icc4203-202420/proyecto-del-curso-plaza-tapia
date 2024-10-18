import React, { useState, useEffect } from 'react';
import { API, PORT } from '@env';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BeersScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [beers, setBeers] = useState([]);
    const [filteredBeers, setFilteredBeers] = useState([]);
    useEffect(() => {
        const fetchBeers = async () => {
            try {
                const response = await axios.get(`http://${API}:${PORT}/api/v1/beers`);
                setBeers(response.data.beers);
                setFilteredBeers(response.data.beers);
            }
            catch (error) { console.error('Error fetching beers:', error); }
        };
        fetchBeers();
    }, []);
    const handleSearch = (text) => {
        console.log('Search input:', text);
        setQuery(text);

        if (text === '') { setFilteredBeers(beers); } 
        else {
            const filtered = beers.filter((beer) => beer.name.toLowerCase().includes(text.toLowerCase()));
            console.log('Filtered beers:', filtered);
            setFilteredBeers(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search for Beers</Text>
            <TextInput
                style={styles.input}
                placeholder="Type beer name"
                value={query}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredBeers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Beer', { beerId: item.id })} >
                        <View style={styles.beerItem}>
                            <Text style={styles.beerName}>{item.name}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    beerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    beerName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default BeersScreen;