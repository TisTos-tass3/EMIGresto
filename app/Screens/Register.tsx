import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function RegisterScreen() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [matricule, setMatricule] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sexe, setSexe] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ETUDIANT');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          prenom,
          matricule,
          email,
          telephone,
          password,
          sexe,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Compte créé avec succès.");
        setNom(''); setPrenom(''); setMatricule(''); setEmail('');
        setTelephone(''); setPassword(''); setConfirmPassword(''); setSexe('');
        router.push('/Screens/Login');
      } else {
        console.log("Erreur côté backend:", data);
        Alert.alert("Erreur", "Création échouée : " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      Alert.alert("Erreur", "Impossible de joindre le serveur.");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-blue-700 mb-6">Créer un nouveau compte</Text>

      <TextInput placeholder="Nom" value={nom} onChangeText={setNom} className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />
      <TextInput placeholder="Prénom" value={prenom} onChangeText={setPrenom} className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />
      <TextInput placeholder="Numéro de matricule" value={matricule} onChangeText={setMatricule} className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />
      <TextInput placeholder="Adresse mail" value={email} onChangeText={setEmail} className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />
      <TextInput placeholder="Numéro de téléphone" value={telephone} onChangeText={setTelephone} className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />

      <View className="bg-gray-100 p-3 rounded mb-4">
        <RNPickerSelect
          onValueChange={setSexe}
          value={sexe}
          placeholder={{ label: 'Sexe', value: null, color: '#c1c1c1' }}
          items={[
            { label: 'Masculin', value: 'M' },
            { label: 'Féminin', value: 'F' },
          ]}
          style={{
            inputIOS: { fontSize: 16, color: '#000' },
            inputAndroid: { fontSize: 16, color: '#000' },
            placeholder: { color: '#c1c1c1' },
          }}
        />
      </View>

      <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />
      <TextInput placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry className="bg-gray-100 p-3 rounded mb-4" placeholderTextColor="#c1c1c1" />

      <TouchableOpacity className="bg-blue-700 p-3 rounded-xl mb-4" onPress={handleRegister}>
        <Text className="text-white text-center font-bold">CRÉER UN COMPTE</Text>
      </TouchableOpacity>

      <Text className="text-center text-sm">
        Vous avez déjà un compte ?{' '}
        <Text className="font-bold text-blue-700" onPress={() => router.push('/Screens/Login')}>
          Se connecter
        </Text>
      </Text>
    </View>
  );
}
