import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // Para decodificar el JWT
import { API, PORT } from '@env'; // Para obtener la variable de entorno API

const FeedScreen = () => {
  const [posts, setPosts] = useState([]); // Estado para las reseñas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [refreshing, setRefreshing] = useState(false); // Estado para saber si se está refrescando
  const [api, setAPI] = useState(API); // Estado para la variable de entorno API
  const [port, setPORT] = useState(PORT); // Estado para la variable de entorno PORT

  // Obtener las reseñas de los amigos al montar el componente
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Obtener el token JWT
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      // Hacer la solicitud para obtener las reseñas de los amigos
      const response = await fetch(`http://${api}:${port}/api/v1/friends_reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Autenticación con el token
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Ordenar las reseñas de más nuevas a más viejas
        const sortedReviews = result.reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedReviews); // Actualizar el estado con las reseñas ordenadas
      } else {
        Alert.alert('Error', 'No se pudieron cargar las reseñas.');
      }
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
      Alert.alert('Error', 'Hubo un problema al cargar las reseñas.');
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  // Función para refrescar cuando el usuario hace "pull-to-refresh"
  const handleRefresh = () => {
    setRefreshing(true); // Establecer que está refrescando
    fetchReviews(); // Llamar a la función para obtener las reseñas
    setRefreshing(false); // Finalizar refresco después de obtener las reseñas
  };

  useEffect(() => {
    fetchReviews(); // Llamamos a la función para obtener las reseñas cuando el componente se monta
  }, []); // Este efecto se ejecuta una sola vez al montar el componente

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reseñas de tus Amigos</Text>
      <FlatList
        data={posts} // Las reseñas que se mostrarán
        keyExtractor={(item) => item.id.toString()} // Usar el id de cada reseña como key
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.postText}>Rating: {item.rating}</Text>
            <Text style={styles.postText}>Por: {item.user_name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay reseñas aún.</Text>}
        refreshing={refreshing} // Indica si está en proceso de refresco
        onRefresh={handleRefresh} // Función que se ejecuta cuando el usuario hace pull-to-refresh
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
