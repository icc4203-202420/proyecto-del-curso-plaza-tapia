import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const DropdownMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const goToCategory = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.menuWrapper}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Icon name="menu-outline" size={24} color="#333" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Options</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Home')}>
              <Icon name="home-outline" size={30} color="#gray" />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Profile')}>
              <Icon name="person-circle-outline" size={30} color="#007bff" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Bars')}>
              <Icon name="location-outline" size={30} color="#0d9fff" />
              <Text style={styles.menuText}>Bars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Beers')}>
              <Icon name="beer-outline" size={30} color="#ff9800" />
              <Text style={styles.menuText}>Beers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Users')}>
              <Icon name="people-outline" size={30} color="#4caf50" />
              <Text style={styles.menuText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => goToCategory('Friends')}>
              <Icon name="heart-outline" size={30} color="#e91e63" />
              <Text style={styles.menuText}>Friends</Text>
            </TouchableOpacity>

            {/* Botón para cerrar el menú */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuWrapper: {
    position: 'absolute',
    top: 20, // Espaciado desde la parte superior
    left: 20, // Espaciado desde la derecha
    zIndex: 1000, // Asegura que el botón esté por encima de otros elementos
  },
  menuButton: {
    padding: 5, // Reduce el área táctil
    backgroundColor: 'transparent', // Sin fondo
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DropdownMenu;
