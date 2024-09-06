// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './(tabs)/index';  // The Home screen defined in index.tsx
import SignInScreen from './(tabs)/signin';
import AgeInputScreen from './(tabs)/ageinput';
import ValueSelectionScreen from './(tabs)/valueselection';

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
        <Stack.Screen name="SignIn">
          {(props) => <SignInScreen {...props} onDataChange={handleDataChange} />}
        </Stack.Screen>
        <Stack.Screen name="AgeInput">
          {(props) => <AgeInputScreen {...props} onDataChange={handleDataChange} />}
        </Stack.Screen>
        <Stack.Screen name="ValueSelection">
          {(props) => <ValueSelectionScreen {...props} formData={formData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
