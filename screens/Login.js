// Login.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playStartSound } from '../constants/constants';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            navigation.navigate('Home');

        } else {
            navigation.navigate('Login');

        }
      };
  
      checkUser();

  }, [])
  
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.navigate('Home');
      playStartSound()

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Вход</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Войти" onPress={handleLogin} />
      <Button title="Нету Аккаунта?" onPress={() =>  navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
