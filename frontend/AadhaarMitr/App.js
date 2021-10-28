import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, OTPScreen } from './Components/LoginPage';
import { useFonts } from 'expo-font';
import { Sora_600SemiBold } from '@expo-google-fonts/sora';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { View } from 'react-native';
import HomePage from './Components/HomePage';
import { InboundRequestScreen, OutboundboundRequestScreen } from './Components/RequestPages';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function RequestsScreens() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Incoming" component={InboundRequestScreen} />
      <Tab.Screen name="Outgoing" component={OutboundboundRequestScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  let [fontsLoaded] = useFonts({ Sora_600SemiBold, Roboto_400Regular });

  if (!fontsLoaded) {
    return (
      <AppLoading/>
    );
  }
  else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="HomeScreen" component={HomePage} options={{ headerShown: false }}/>
          <Stack.Screen name="RequestsScreen" component={RequestsScreens} options={{ title: 'Requests' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;