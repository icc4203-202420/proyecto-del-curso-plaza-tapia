import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { API, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BarsScreen = ({ navigation }) => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/bars`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setBars(data.bars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Bars...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bars}
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
  );
};

const styles = StyleSheet.create({
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