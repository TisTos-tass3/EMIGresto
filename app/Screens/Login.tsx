// LoginScreen.js
import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-blue-700 mb-2">Bienvenue sur</Text>
      <Text className="text-2xl font-bold text-red-500 mb-6">EMIGResto</Text>

      <TextInput
        placeholder="Numéro de matricule ou numéro unique"
        placeholderTextColor='#C1C1C1'
        className="bg-gray-100 p-3 rounded mb-4"
      />
      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor='#C1C1C1'
        secureTextEntry
        className="bg-gray-100 p-3 rounded mb-2"
      />

      <TouchableOpacity className="mb-4">
        <Text className="text-right text-sm text-gray-800">Mot de passe oublié?</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-blue-700 p-3 rounded-xl mb-4">
        <Text className="text-white text-center font-bold">SE CONNECTER</Text>
      </TouchableOpacity>

      <Text className="text-center text-sm text-gray-400">
        Vous n’avez pas de compte?{' '}
        <Text
          className="font-bold text-gray-800"
          
        >
          Créer un compte
        </Text>
      </Text>
    </SafeAreaView>
  );
}
