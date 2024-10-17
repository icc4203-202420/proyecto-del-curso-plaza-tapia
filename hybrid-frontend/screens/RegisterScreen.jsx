import { StatusBar } from 'expo-status-bar';
import { CommonActions } from '@react-navigation/native';
import { API, PORT } from '@env';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async () => {
    const url = `http://${API}:${PORT}/api/v1/signup`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            first_name,
            last_name,
            handle,
            password,
            password_confirmation,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error');
      }

      // Alert.alert('Registro exitoso', data.message);
      const loginResponse = await fetch(`http://${API}:${PORT}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Error al iniciar sesión después del registro');
      }

      // Guardar token JWT en AsyncStorage
      await AsyncStorage.setItem('jwt', loginData.token); // Guardar el token en AsyncStorage

      // Redirigir a Home después del inicio de sesión automático
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        })
      );

    } catch (error) {
      Alert.alert('Error en el registro', error.message);
      setPassword('');
      setPasswordConfirmation('');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={first_name}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={last_name}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={handle}
        onChangeText={setHandle}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmación de contraseña"
        value={password_confirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={handleRegister} />
      <Button
        title="¿Ya tienes una cuenta? Inicia sesión"
        onPress={() => navigation.navigate('Login')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
