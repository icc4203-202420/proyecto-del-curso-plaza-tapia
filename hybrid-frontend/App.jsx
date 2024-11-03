import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

import FriendshipRequestsScreen from './screens/FriendshipRequestsScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import FriendsScreen from './screens/FriendsScreen';
import ReviewScreen from './screens/ReviewScreen';
// import FriendScreen from './screens/FriendScreen';
import DetailsScreen from './screens/DetailsScreen';
import LoginScreen from './screens/LoginScreen';
import BeersScreen from './screens/BeersScreen';
import UsersScreen from './screens/UsersScreen';
import UserScreen from './screens/UserScreen';
import BeerScreen from './screens/BeerScreen';
import HomeScreen from './screens/HomeScreen';
import BarsScreen from './screens/BarsScreen';          // Nueva pantalla de lista de bares
import BarScreen from './screens/BarScreen';
import EventScreen from './screens/EventScreen';

const Stack = createNativeStackNavigator();

const App = () => {

  const handleLogout = async (navigation) => {
    await AsyncStorage.removeItem('jwt');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    );
  };

  const screenOptions = (navigation) => ({
    headerRight: () => (
      <TouchableOpacity onPress={() => handleLogout(navigation)} style={{ marginRight: 15 }}>
        <Text style={{ color: '#007BFF' }}>Logout</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name='FriendshipRequests' component={FriendshipRequestsScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Register" component={RegisterScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Details" component={DetailsScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Friends" component={FriendsScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Review" component={ReviewScreen} options={({ navigation }) => screenOptions(navigation)} />
        {/* <Stack.Screen name='Friend' component={FriendScreen} options={({ navigation }) => screenOptions(navigation)} /> */}
        <Stack.Screen name="Beers" component={BeersScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Users" component={UsersScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="User" component={UserScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Beer" component={BeerScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Bars" component={BarsScreen} options={({ navigation }) => screenOptions(navigation)} /> 
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Bar" component={BarScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Event" component={EventScreen} options={({ navigation }) => screenOptions(navigation)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;