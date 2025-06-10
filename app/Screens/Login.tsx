// LoginScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      console.log({ email: email, password });
      const response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Connexion réussie!');
        console.log('Login successful:', data);

        // --- STOCKAGE DES TOKENS JWT ---
        // CORRECTED: Changed 'accessToken' to 'access_token' to match homepage.tsx
        await AsyncStorage.setItem('access_token', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        // -----------------------------

        router.push('/Screens/homepage');
      } else {
        Alert.alert('Erreur de connexion', data.detail || JSON.stringify(data) || 'Identifiants incorrects.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-blue-700 mb-2">Bienvenue sur</Text>
      <Text className="text-2xl font-bold text-red-500 mb-6">EMIGResto</Text>

      <TextInput
        placeholder="Numéro de matricule ou adresse mail"
        placeholderTextColor='#C1C1C1'
        className="bg-gray-100 p-3 rounded mb-4"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor='#C1C1C1'
        secureTextEntry
        className="bg-gray-100 p-3 rounded mb-2"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity className="mb-4" onPress={() => { /* Implement navigation to Forgot Password screen */ }}>
        <Text className="text-right text-sm text-gray-800">Mot de passe oublié?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-700 p-3 rounded-xl mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">
          {loading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-sm text-gray-400">
        Vous n’avez pas de compte?{' '}
        <Text
          className="font-bold text-gray-800"
          onPress={() => router.push('/Screens/Register')}
        >
          Créer un compte
        </Text>
      </Text>
    </SafeAreaView>
  );
}