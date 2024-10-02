// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LogInScreen from './login';
import SignInScreen from './signin'; // Screen to sign in
import AgeInputScreen from './ageinput'; // Screen to input age
import ValueSelectionScreen from './valueselection'; // Screen to select values
import VideoSelectionScreen from './videoselection'; 

const Stack = createStackNavigator();

export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: '',
    values: [],
  });

  const handleDataChange = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <NavigationContainer>
     
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="LogIn">
            {(props) => <LogInScreen {...props} onDataChange={handleDataChange} />}
        </Stack.Screen>
        <Stack.Screen name="SignIn">
          {(props) => <SignInScreen {...props} onDataChange={handleDataChange} />}
        </Stack.Screen>
        <Stack.Screen name="AgeInput">
          {(props) => <AgeInputScreen {...props} onDataChange={handleDataChange} />}
        </Stack.Screen>
        <Stack.Screen name="ValueSelection">
          {(props) => <ValueSelectionScreen {...props} formData={formData} />}
        </Stack.Screen>
        <Stack.Screen name="VideoSelection">
          {(props) => <VideoSelectionScreen {...props} formData={formData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
