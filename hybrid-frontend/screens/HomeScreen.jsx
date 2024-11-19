import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, FlatList, Button, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, PORT } from '@env';
import DropdownMenu from '../utils/DropdownMenu';
import DropDownPicker from 'react-native-dropdown-picker';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false); 
  const [api, setAPI] = useState(API); 
  const [port, setPORT] = useState(PORT);
  const [postType, setPostType] = useState(null); // Type of post: 0 (review), 1 (photo), 2 (attendance)
  const [selectedFriend, setSelectedFriend] = useState(null); 
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null); 
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [dropdownOpen, setDropdownOpen] = useState({
    postType: false,
    friend: false,
    beer: false,
    bar: false,
    country: false,
  });


  const fetchPosts = async () => {
    setLoading(true);
    try {
      
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      let sortedReviews = [];
      let sortedPhotos = [];
      let sortedAttendances = [];

      const reviewsResponse = await fetch(`http://${api}:${port}/api/v1/friends_reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
      const reviewsResult = await reviewsResponse.json();
      console.log("REVIEWS: ", reviewsResult);
      if (reviewsResponse.ok) {
        sortedReviews = reviewsResult.reviews
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((review) => ({ ...review, type: 0 })); // Add a "type" to identify reviews
      }

      const photosResponse = await fetch(`http://${api}:${port}/api/v1/friends_photos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,   
        },
      });
      const photosResult = await photosResponse.json();
      console.log("PHOTOS: ", photosResult);
      if (photosResponse.ok) {
        sortedPhotos = photosResult.photos
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((photo) => ({ ...photo, type: 1 }));
      }

      const attendancesResponse = await fetch(`http://${api}:${port}/api/v1/friends_attendances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
      const attendancesResult = await attendancesResponse.json();
      console.log("ATTENDANCES: ", attendancesResult);
      sortedAttendances = [];
      if (attendancesResponse.ok) {
        sortedAttendances = attendancesResult.attendances
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((attendance) => ({ ...attendance, type: 2 }));
      }
      else {
        console.log("attendanceResponse.ok", attendancesResponse.ok);
      }
      console.log("sortedAttendances: ", sortedAttendances);

      const combinedData = [...sortedReviews, ...sortedPhotos, ...sortedAttendances].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setPosts(combinedData);
      console.log("THESE POSTS: ", combinedData);
      setFilteredPosts(combinedData);

    } catch (error) {
      console.error('Error obtaining posts:', error);
    } finally {
      setLoading(false); 
    }
  };

  

  const applyFilters = () => {
    console.log("Applying filters...");
    console.log("Original posts:", posts);
    console.log("Current Filters:", { postType, selectedFriend, selectedBeer, selectedBar, selectedCountry });
  
    let filtered = [...posts]; // Clone the posts array
  
    if (postType !== null) {
      const postTypeInt = parseInt(postType, 10); // Convert postType to integer
      filtered = filtered.filter((post) => post.type === postTypeInt);
      console.log("After filtering by postType:", filtered);
    }
  
    if (selectedFriend) {
      filtered = filtered.filter((post) => post.handle === selectedFriend);
      console.log("After filtering by selectedFriend:", filtered);
    }
  
    if (selectedBeer) {
      filtered = filtered.filter((post) => post.beer_name === selectedBeer);
      console.log("After filtering by selectedBeer:", filtered);
    }
  
    if (selectedBar) {
      filtered = filtered.filter((post) => post.bar === selectedBar);
      console.log("After filtering by selectedBar:", filtered);
    }
  
    if (selectedCountry) {
      filtered = filtered.filter((post) => post.country === selectedCountry);
      console.log("After filtering by selectedCountry:", filtered);
    }
  
    setFilteredPosts(filtered);
    console.log("Filtered posts ready for display:", filtered);
  };
  
  const handleRefresh = () => {
    setRefreshing(true); 
    fetchPosts(); 
    setRefreshing(false); 
  };

  useEffect(() => {
    fetchPosts(); 
  }, []); 

  return (
    <>
      <View style={styles.container1}>
          <DropdownMenu />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
        <Button
          style={styles.filterButton}
          title={showFilters ? "Hide Filters" : "Filter Posts"}
          onPress={() => setShowFilters((prev) => !prev)}
        />
    
        {/* Conditionally Render Filters or Posts */}
        {showFilters ? (
          <View style={styles.filtersContainer}>
            <View style={{ zIndex: 1000 }}>
              <DropDownPicker
                open={dropdownOpen.postType}
                value={postType}
                items={[
                  { label: 'All Posts', value: null },
                  { label: 'Reviews', value: 0 },
                  { label: 'Photos', value: 1 },
                  { label: 'Attendances', value: 2 },
                ]}
                setOpen={() => setDropdownOpen((prev) => ({ ...prev, postType: !prev.postType }))}
                setValue={setPostType}
                placeholder="Select Post Type"
                style={styles.filter}
              />
            </View>
    
            <View style={{ zIndex: 900 }}>
              <DropDownPicker
                open={dropdownOpen.friend}
                value={selectedFriend}
                items={[
                  { label: 'All Friends', value: null },
                  ...[...new Set(posts.map((post) => post.handle))].map((friendHandle) => ({
                    label: friendHandle,
                    value: friendHandle,
                  })),
                ]}
                setOpen={() => setDropdownOpen((prev) => ({ ...prev, friend: !prev.friend }))}
                setValue={setSelectedFriend}
                placeholder="Select Friend"
                style={styles.filter}
              />
            </View>
    
            <View style={{ zIndex: 800 }}>
              <DropDownPicker
                open={dropdownOpen.beer}
                value={selectedBeer}
                items={[
                  { label: 'All Beers', value: null },
                  ...[...new Set(posts.filter((p) => p.type === 0).map((p) => p.beer_name))].map(
                    (beerName) => ({
                      label: beerName,
                      value: beerName,
                    })
                  ),
                ]}
                setOpen={() => setDropdownOpen((prev) => ({ ...prev, beer: !prev.beer }))}
                setValue={setSelectedBeer}
                placeholder="Select Beer"
                style={styles.filter}
              />
            </View>
    
            <View style={{ zIndex: 700 }}>
              <DropDownPicker
                open={dropdownOpen.bar}
                value={selectedBar}
                items={[
                  { label: 'All Bars', value: null },
                  ...[...new Set(posts.filter((p) => p.type === 1 || p.type === 2).map((p) => p.bar))]
                    .filter(Boolean)
                    .map((barName) => ({ label: barName, value: barName })),
                ]}
                setOpen={() => setDropdownOpen((prev) => ({ ...prev, bar: !prev.bar }))}
                setValue={setSelectedBar}
                placeholder="Select Bar"
                style={styles.filter}
              />
            </View>
    
            <View style={{ zIndex: 600 }}>
              <DropDownPicker
                open={dropdownOpen.country}
                value={selectedCountry}
                items={[
                  { label: 'All Countries', value: null },
                  ...[...new Set(posts.filter((p) => p.type === 1 || p.type === 2).map((p) => p.country))]
                    .filter(Boolean)
                    .map((countryName) => ({ label: countryName, value: countryName })),
                ]}
                setOpen={() => setDropdownOpen((prev) => ({ ...prev, country: !prev.country }))}
                setValue={setSelectedCountry}
                placeholder="Select Country"
                style={styles.filter}
              />
            </View>
    
            {/* Apply Filters Button */}
            <Button
              title="Apply Filters"
              onPress={() => {
                applyFilters();
                setShowFilters(false); // Automatically hide filters after applying
              }}
            />
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              if (item.type === 0) {
                return (
                  <TouchableOpacity
                    style={styles.post}
                    onPress={() => navigation.navigate('Beer', { beerId: item.beer_id })}
                  >
                    <View style={styles.post}>
                      <Text style={styles.postText}>Beer: {item.beer_name}</Text>
                      <Text style={styles.postText}>Review: {item.text}</Text>
                      <Text style={styles.postText}>Rating: {item.rating}</Text>
                      <Text style={styles.postText}>By: {item.handle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              } else if (item.type === 1) {
                return (
                  <TouchableOpacity
                    style={styles.post}
                    onPress={() => navigation.navigate('Event', { eventId: item.event_id })}
                  >
                    <View style={styles.post}>
                      <Image source={{ uri: item.url }} style={styles.image} />
                      <Text style={styles.postText}>Event: {item.event_name}</Text>
                      <Text style={styles.postText}>Bar: {item.bar}</Text>
                      <Text style={styles.postText}>By: {item.handle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              } else if (item.type === 2) {
                return (
                  <TouchableOpacity
                    style={styles.post}
                    onPress={() => navigation.navigate('Event', { eventId: item.event_id })}
                  >
                    <View style={styles.post}>
                      <Text style={styles.postText}>
                        {item.handle} confirmed attendance to {item.event_name}
                      </Text>
                      <Text style={styles.postText}>Bar: {item.bar}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
            ListEmptyComponent={<Text style={styles.emptyText}>No posts match your criteria.</Text>}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({

  filtersContainer: {
    paddingBottom: 100,
    marginBottom: 10,
  },
  dropdownWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    zIndex: 1000, // Ensures dropdowns are rendered above posts
  },
  filter: {
    marginBottom: 10,
    zIndex: 10, // To ensure dropdown visibility
  },
  container1: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    maxHeight: 0,
  },
  image: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    maxHeight: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    height: '7%',
    alignSelf: 'center',
    justifyContent: 'center',
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

export default HomeScreen;
