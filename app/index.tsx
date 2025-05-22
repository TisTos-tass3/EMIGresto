
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Button
        title="Go to Homepage"
        onPress={() => router.push('./Screens/homepage')}
      />
      <Button
        title="Go to Login"
        onPress={() => router.push('./Screens/Login')}
      />
      <Button
        title="Go to Register"
        onPress={() => router.push('./Screens/Register')}
      />
      <Button
        title="Go to Notification"
        onPress={() => router.push('/Screens/notificationPage')}
      />
       <Button
        title="Go to Profile"
        onPress={() => router.push('/Screens/profilePage')}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;