import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, OTPScreen, SelectionScreen } from './Components/LoginPage';
import { useFonts } from 'expo-font';
import { Sora_600SemiBold } from '@expo-google-fonts/sora';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';

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
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SelectionScreen" component={SelectionScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;