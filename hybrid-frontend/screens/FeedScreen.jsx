import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; 
import { API, PORT } from '@env'; 

const FeedScreen = () => {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false); 
  const [api, setAPI] = useState(API); 
  const [port, setPORT] = useState(PORT); 

  const fetchReviews = async () => {
    setLoading(true);
    try {
      
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      const response = await fetch(`http://${api}:${port}/api/v1/friends_reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      const result = await response.json();
      if (response.ok) {
        
        var sortedReviews = result.reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        sortedReviews = sortedReviews.map((review) => ({ // Testear, hecho en aeropuerto sin internet
          ...review,
          type: 0
        }));
        setPosts(sortedReviews); // Esto debería ir al final cuando se tengan los tres tipos de posts
      }
    } catch (error) {
      console.error('Error obtaining posts:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true); 
    fetchReviews(); 
    setRefreshing(false); 
  };

  useEffect(() => {
    fetchReviews(); 
  }, []); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend's posts</Text>
      <FlatList
        data={posts} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.beer_name}</Text>
            <Text style={styles.postText}>Review: {item.text}</Text>
            <Text style={styles.postText}>Rating: {item.rating}</Text>
            <Text style={styles.postText}>By: {item.handle}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts.</Text>}
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  post: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  postText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FeedScreen;
