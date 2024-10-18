import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import RegisterScreen from './screens/RegisterScreen';
import DetailScreen from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import BeersScreen from './screens/BeersScreen';
import BeerScreen from './screens/BeerScreen';
import HomeScreen from './screens/HomeScreen';
import ReviewScreen from './screens/ReviewScreen';
import ReviewsScreen from './screens/ReviewsScreen';

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
        <Text style={{ color: '#007BFF', fontSize: 20 }}>Logout</Text>
      </TouchableOpacity>
    ),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Details" component={DetailScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Beers" component={BeersScreen} options={({ navigation }) => screenOptions(navigation)} />
        <Stack.Screen name="Beer" component={BeerScreen} options={({ navigation }) => screenOptions(navigation)} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;