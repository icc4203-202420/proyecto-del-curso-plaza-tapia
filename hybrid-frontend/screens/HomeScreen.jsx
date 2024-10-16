import React from 'react';
import { View, Text, Button } from 'react-native';


const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Buscar Cervezas"
        onPress={() => navigation.navigate('SearchBeers')}  // Update to navigate to SearchBeers
      />
    </View>
  );
};

export default HomeScreen;
