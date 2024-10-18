import React, { useEffect, useState } from 'react';
import { API, PORT } from '@env';
import { View, Text, StyleSheet, Button } from 'react-native';

const BeerScreen = ({ route, navigation }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);

  useEffect(() => {
    // Fetch details of the beer from the API
    const fetchBeerDetails = async () => {
      try {
        const response = await fetch(`http://${API}:${PORT}/api/v1/beers/${beerId}`);
        const data = await response.json();
        setBeer(data.beer);
      } catch (error) {
        console.error(error);
        console.log('Error fetching beer details:', error);
      }
    };


    fetchBeerDetails();
  }, [beerId]);

  if (!beer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{beer.name}</Text>
      <Text style={styles.detail}>Style: {beer.style}</Text>
      <Text style={styles.detail}>Hop: {beer.hop}</Text>
      <Text style={styles.detail}>Yeast: {beer.yeast}</Text>
      <Text style={styles.detail}>Malts: {beer.malts}</Text>
      <Text style={styles.detail}>IBU: {beer.ibu ? beer.ibu.slice(0, -3) : 'Not available'}</Text>
      <Text style={styles.detail}>Alcohol: {beer.alcohol}</Text>
      <Text style={styles.detail}>BLG: {beer.blg ? beer.blg.slice(0, -3) : 'Not available'}</Text>
      <Text style={styles.detail}>Average rating: {beer.avg_rating}</Text>
      <Button
        title="Write a Review"  // Texto del botón
        onPress={() => navigation.navigate('ReviewScreen', { beerId: beerId })}  // Navegación a 'ReviewScreen' pasando 'beerId' como parámetro
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BeerScreen;
