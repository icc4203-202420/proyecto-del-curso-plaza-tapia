import React, { useEffect, useState } from 'react';
import { View,Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BarsScreen = ({ navigation }) => {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);
  console.log(`API: ${api}, PORT: ${port}`);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/bars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setBars(data.bars);
        setFilteredBars(data.bars); 
      } catch (error) {
        console.error('Error fetching bars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = bars.filter((bar) =>
      bar.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBars(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Bars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search bars..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Bar', { barId: item.id })}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default BarsScreen;