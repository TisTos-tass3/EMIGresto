// RegisterScreen.js
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';


export default function RegisterScreen() {
  const [section, setSection] = useState('');
  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-blue-700 mb-6">Créer un nouveau compte</Text>

      <TextInput placeholder="Nom complet" className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor='#c1c1c1' />
      <TextInput placeholder="Numero de matricule" className="bg-gray-100 p-3 rounded mb-4"  placeholderTextColor='#c1c1c1' />
      <TextInput placeholder="Numéro de téléphone" className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor='#c1c1c1' />

      <View className="bg-gray-100 p-3 rounded mb-4">
        <RNPickerSelect
          onValueChange={(value) => setSection(value)}
          value={section}
          placeholder={{ label: 'Section', value: null, color: '#c1c1c1' }}
          items={[
            { label: 'Fille', value: 'fille' },
            { label: 'Garçon', value: 'garcon' },
          ]}
          style={{
            inputIOS: {
              fontSize: 16,
              color: '#000',
            },
            inputAndroid: {
              fontSize: 16,
              color: '#000',
            },
            placeholder: {
              color: '#c1c1c1',
            },
          }}
        />
      </View>

      <TextInput placeholder="Mot de passe" secureTextEntry className="bg-gray-100 p-3 rounded mb-4"  placeholderTextColor='#c1c1c1' />
      <TextInput placeholder="Confirmer le mot de passe" secureTextEntry className="bg-gray-100 p-3 rounded mb-4"  placeholderTextColor='#c1c1c1' />

      <TouchableOpacity className="bg-blue-700 p-3 rounded-xl mb-4" >
        <Text className="text-white text-center font-bold">CRÉER UN COMPTE</Text>
      </TouchableOpacity>

      <Text className="text-center text-sm">
        Vous avez déjà un compte?{' '}
        <Text
          className="font-bold"
    
        >
          Se connecter
        </Text>
      </Text>
    </View>
  );
}
