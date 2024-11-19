import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { API, PORT } from '@env';
import DropdownMenu from '../utils/DropdownMenu';

const BeerScreen = ({ route, navigation }) => {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [brand, setBrand] = useState(null);
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);
  const [review, setReview] = useState([]);
  const [userReviewExists, setUserReviewExists] = useState(false);
  const [api, setAPI] = useState(API);
  const [port, setPORT] = useState(PORT);
  console.log(`API: ${api}, PORT: ${port}`);

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        console.log(`API: ${api}, PORT: ${port}`);
        const token = await AsyncStorage.getItem('jwt');
        const response = await fetch(`http://${api}:${port}/api/v1/beers/${beerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setBeer(data.beer);

        const reviewResponse = await fetch(`http://${api}:${port}/api/v1/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const reviewData = await reviewResponse.json();
        const filteredReviews = reviewData.reviews.filter((review) => review.beer_id === beerId);
        setReview(filteredReviews);
        setUserReviewExists(filteredReviews.length > 0);

        if (data.beer.brand_id) {
          const brandResponse = await fetch(`http://${api}:${port}/api/v1/brands/${data.beer.brand_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const brandData = await brandResponse.json();
          setBrand(brandData.name);

          if (brandData && brandData.brewery_id) {
            const breweryResponse = await fetch(`http://${api}:${port}/api/v1/breweries/${brandData.brewery_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const breweryData = await breweryResponse.json();
            setBrewery(breweryData.name);
          }
        }

        const barsResponse = await fetch(`http://${api}:${port}/api/v1/beers/${beerId}/bars`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const barsData = await barsResponse.json();
        setBars(barsData.bars);

      } catch (error) {
        console.error('Error fetching beer details:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchBeerDetails();
    });
  
    // Limpia el listener al desmontar el componente
    return unsubscribe;
  }, [beerId]); // Cada vez que cambia beerId, se vuelve a cargar


  if (!beer) {
    return (
      <>
        <View style={styles.container1}>
            <DropdownMenu />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.container1}>
          <DropdownMenu />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.centeredContainer}>
          <Text style={styles.name}>{beer.name}</Text>
          {brand && brewery && (
            <Text style={styles.subDetail}>{brand} ({brewery})</Text>
          )}
        </View>
        {!userReviewExists && (
          <Button title="Write your review" onPress={() => navigation.navigate('Review', { beerId })} />
        )}
        <View style={styles.centeredContainer}>
          <Button title="See reviews" onPress={() => navigation.navigate('Reviews', { beerId })} />
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
            {userReviewExists && (
              <Text style={styles.detail}>{review[0].rating}</Text>
            )}
            {!userReviewExists && (
              <Text style={styles.detail}>Not rated</Text>
            )}
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

        {userReviewExists && (
          <View style={styles.card}>
            <Text style={styles.detailTitle}>Your review</Text>
            <Text style={styles.detail}>Rating: {review[0]?.rating}</Text>
            <Text style={styles.detail}>{review[0]?.text}</Text>
          </View>
        )}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default BeerScreen;
