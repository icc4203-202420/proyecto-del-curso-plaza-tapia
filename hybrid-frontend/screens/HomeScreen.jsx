import React from 'react';
import { View, Button, StyleSheet} from 'react-native';
import Navbar from '../components/Navbar';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.content}>
        <Button
          title="Search for Beers"
          onPress={() => navigation.navigate('Beers')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
});

export default HomeScreen;
