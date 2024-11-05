import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
    const navigation = useNavigation();

    // Función para navegar a la pantalla de perfil del usuario
    const goToProfile = () => {
        navigation.navigate('Profile'); // Asegúrate de que la pantalla de perfil esté registrada en tu configuración de navegación
    };

    // Funciones para navegar a cada tipo de búsqueda específica
    const goToSearch = (category) => {
        navigation.navigate('SearchScreen', { category }); // Enviar la categoría a la pantalla de búsqueda
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Título de la pantalla */}
            <Text style={styles.title}>Beer Finder</Text>

            {/* Botón para acceder al perfil */}
            <TouchableOpacity style={styles.profileButton} onPress={goToProfile}>
                <Icon name="person-circle-outline" size={30} color="#fff" />
                <Text style={styles.buttonText}>Go to Profile</Text>
            </TouchableOpacity>

            {/* Opciones de búsqueda por categoría */}
            <Text style={styles.sectionTitle}>Search Categories</Text>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Bars')}>
                    <Icon name="location-outline" size={30} color="#0d9fff" />
                    <Text style={styles.categoryText}>Bars</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Beers')}>
                    <Icon name="beer-outline" size={30} color="#ff9800" />
                    <Text style={styles.categoryText}>Beers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Users')}>
                    <Icon name="people-outline" size={30} color="#4caf50" />
                    <Text style={styles.categoryText}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Friends')}>
                    <Icon name="heart-outline" size={30} color="#e91e63" />
                    <Text style={styles.categoryText}>Friends</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f3f3f3',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 20,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    categoryButton: {
        alignItems: 'center',
        width: '48%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    categoryText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default HomeScreen;
