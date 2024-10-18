import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';
import React, { useEffect, useState } from 'react';

const BeerScreen = ({ route, navigation }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [brand, setBrand] = useState(null);
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);


  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        console.log('Token:', token);
        const response = await fetch(`http://${API}:${PORT}/api/v1/beers/${beerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setBeer(data.beer);
        console.log('Beer:', data);
        if (data.beer.brand_id) {
          const brandResponse = await fetch(`http://${API}:${PORT}/api/v1/brands/${data.beer.brand_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const brandData = await brandResponse.json();
          setBrand(brandData.name);
          if (brandData && brandData.brewery_id) {
            const breweryResponse = await fetch(`http://${API}:${PORT}/api/v1/breweries/${brandData.brewery_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            const breweryData = await breweryResponse.json();
            setBrewery(breweryData.name);
          }
        }
        const barsResponse = await fetch(`http://${API}:${PORT}/api/v1/beers/${beerId}/bars`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const barsData = await barsResponse.json();
        console.log('barsData', barsData);
        setBars(barsData.bars);

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
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.name}>{beer.name}</Text>
        {brand && brewery && (
          <Text style={styles.subDetail}>{brand} ({brewery})</Text>
        )}
      </View>
      <Button title="Write your review" onPress={() => navigation.navigate('ReviewScreen', { beerId })} />
      <View style={styles.centeredContainer}>
        <Button title="See reviews" onPress={() => navigation.navigate('ReviewsScreen', { beerId })} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Average rating:</Text>
          <Text style={styles.detail}>
            {beer.avg_rating ? beer.avg_rating : 'Not rated'}
          </Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Your rating:</Text>
          <Text style={styles.detail}>Not rated</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Style:</Text>
          <Text style={styles.detail}>{beer.style}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Hop:</Text>
          <Text style={styles.detail}>{beer.hop}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Yeast:</Text>
          <Text style={styles.detail}>{beer.yeast}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Malts:</Text>
          <Text style={styles.detail}>{beer.malts}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>IBU:</Text>
          <Text style={styles.detail}>{beer.ibu ? beer.ibu.slice(0, -3) : 'Not available'}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>Alcohol:</Text>
          <Text style={styles.detail}>{beer.alcohol}</Text>
        </View>
        <View style={styles.detailsSubContainer}>
          <Text style={styles.detailTitle}>BLG:</Text>
          <Text style={styles.detail}>{beer.blg ? beer.blg.slice(0, -3) : 'Not available'}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Bars serving this beer:</Text>
        {bars.length > 0 ? (
          bars.map((bar) => (
            <Text key={bar.id} style={styles.barDetail}>{bar.name}</Text>
          ))
        ) : (
          <Text style={styles.detail}>No bars available</Text>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailsSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  detail: {
    fontSize: 18,
    color: '#777',
  },
  barDetail: {
    marginTop: 10,
    fontSize: 18,
    color: '#777',
  },
  subDetail: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default BeerScreen;
