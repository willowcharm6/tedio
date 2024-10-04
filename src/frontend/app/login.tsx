import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogInScreen({ navigation, onDataChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    // fetch authenticate route, which returns userData
  const handleNext = async () => {
    const finalData = { "email": email, "password": password };
    console.log(`on login: ${finalData}`); // Send this data to the backend

    try {
      // Example backend URL, replace with your actual endpoint
      const response = await fetch('http://localhost:5000/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const responseData = await response.json();
      const userData = JSON.stringify(responseData.user_data)
      console.log('Data received:', userData);
      
      const user_id = responseData.user_data.user_id;
      console.log(`login at L29: ${user_id}`)
      await AsyncStorage.setItem('userID',user_id);
      navigation.navigate('VideoSelection', { jsonFinalData: userData });

      // }

    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again.');
    };
    // if userExists: populate the form with the userData (e.g. age = user_data["age"], etc.)
    // onDataChange({ email, password });
    // navigation.navigate('VideoSelection');
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  }


  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.topButton} onPress = {navigateToSignIn}>
        <Text style = {styles.topButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome to Tedio</Text>
        <Text style={styles.subtitle}>Create value-aligned algorithm for kids</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FEDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButton:{
    position:'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  topButtonText: {
    fontSize: 16,
    color:'1B3D2F',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#F0DA60',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1B3D2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
