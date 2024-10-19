import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Beer Finder!</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Beers')}
        >
          <Text style={styles.buttonText}>Search for Beers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Color de fondo claro
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6c757d', // Color de fondo del botón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Sombra en Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#007BFF', // Color del texto del botón de logout
    fontSize: 16,
  },
});

export default HomeScreen;
