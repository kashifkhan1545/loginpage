import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import UserDataScreen from './UserDataScreen';
import HomeScreen from './HomeScreen';
import AppointmentScreen from './AppointmentScreen'; 
import StatusScreen from './StatusScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />
        <Stack.Screen
          name="UserData"
          component={UserDataScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />
        <Stack.Screen
          name="Home" 
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />

<Stack.Screen
          name="ViewStatus" 
          component={StatusScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />

        {/* Add the AppointmentScreen to the stack */}
        <Stack.Screen
          name="Appointments"
          component={AppointmentScreen}
          options={{
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'purple',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
