import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import ReviewScreen from './screens/ReviewScreen';
import DetailScreen from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import BeersScreen from './screens/BeersScreen';
import UsersScreen from './screens/UsersScreen';
import UserScreen from './screens/UserScreen';
import BeerScreen from './screens/BeerScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Beers" component={BeersScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Beer" component={BeerScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;