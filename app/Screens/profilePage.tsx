// app/profile.tsx

import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importez vos dimensions responsives
import r from '../utils/responsiveDimensions';

// Composant pour un élément d'information personnelle
const ProfileInfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="mb-4">
    <Text className="text-gray-500 text-sm mb-1">{label}</Text>
    <Text className="text-gray-800 text-base font-semibold">{value}</Text>
  </View>
);

export default function ProfilePage() {
  const router = useRouter();
  // Pour gérer l'état de l'onglet sélectionné sur cette page
  const [selectedTab, setSelectedTab] = useState<'home' | 'notif' | 'profile'>('profile');

  return (
    <SafeAreaView className="flex-1 bg-gray-100"> {/* Fond gris clair pour la page */}
      {/* Configuration de l'en-tête de la page avec Expo Router Stack */}
      <Stack.Screen
        options={{
          headerShown: false, // Cache l'en-tête par défaut d'Expo Router
        }}
      />

      {/* En-tête personnalisé avec NativeWind et responsive dimensions */}
      <View
        className="flex-row items-center justify-between bg-white border-b border-gray-200 shadow-lg shadow-black/5 elevation-3"
        style={{ paddingHorizontal: r.paddingHorizontal, paddingVertical: r.paddingTop }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={r.iconSize} color="#2563eb" />
        </TouchableOpacity>
        <Text
          className="font-bold text-blue-700"
          style={{ fontSize: r.headerGreetingFontSize * 0.9 }}
        >
          Votre Compte
        </Text>
        {/* Placeholder pour alignement (si vous avez un bouton à droite de "Votre Compte" à l'avenir) */}
        <View style={{ width: r.iconSize }} />
      </View>

      {/* Contenu principal du profil */}
      <View className="flex-1 px-4 py-6">
        {/* Section photo de profil et nom */}
        <View className="flex-row items-center mb-8">
          <View className="w-20 h-20 bg-gray-300 rounded-full mr-4 justify-center items-center">
            {/* Si vous avez une image de profil réelle, vous la placeriez ici */}
            {/* <Image source={{ uri: 'votre_url_image' }} className="w-full h-full rounded-full" /> */}
            <Feather name="user" size={r.iconSize * 1.5} color="white" />
          </View>
          <Text className="text-gray-900 text-2xl font-bold">Mohammed</Text>
        </View>

        {/* Section Informations personnelles */}
        <Text className="text-gray-600 text-sm font-semibold uppercase mb-4">Informations personnelles</Text>

        <View className="bg-white rounded-lg p-4 shadow-md shadow-black/5 elevation-2">
          <ProfileInfoItem label="Nom complet" value="Mohammed" />
          <ProfileInfoItem label="Numéro de restaurant" value="123456" /> {/* Remplacez par la vraie valeur */}
          <ProfileInfoItem label="Numéro de restaurant" value="789012" /> {/* Remplacez par la vraie valeur */}
          {/* Ajoutez d'autres champs si nécessaire */}
        </View>
      </View>

      {/* BARRE DE NAVIGATION INFÉRIEURE - Copie de homepage.tsx/notifications.tsx */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: r.bottomNavPaddingVertical,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab('notif');
            router.push('/Screens/notificationPage');
          }}
        >
          <Feather name="bell" size={r.bottomNavIconSize} color={selectedTab === 'notif' ? '#3B82F6' : '#4b5563'} />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab('home');
            router.push('/Screens/homepage');
          }}
        >
          <Feather name="home" size={r.bottomNavIconSize} color={selectedTab === 'home' ? '#3B82F6' : '#4b5563'} />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab('profile');
            // On est déjà sur la page de profil, pas besoin de router.push
          }}
        >
          <Feather name="user" size={r.bottomNavIconSize} color={selectedTab === 'profile' ? '#3B82F6' : '#4b5563'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}