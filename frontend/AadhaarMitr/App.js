import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, OTPScreen } from './Components/LoginPage';
import { useFonts } from 'expo-font';
import { Sora_600SemiBold } from '@expo-google-fonts/sora';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import HomePage from './Components/HomePage';
import { InboundRequestScreen, OutboundboundRequestScreen } from './Components/RequestPages';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PasscodeCaptchaScreen, PasscodeOTPScreen, PasscodeScreen } from './Components/PasscodePage';
import { AddressOTPScreen, AddressScreen } from './Components/AccessPage';
import AddressSharingScreen from './Components/AddressSharingPage';
import * as SecureStore from 'expo-secure-store';
import { setClientToken } from './axiosInstance';

async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
}

const Tab = createMaterialTopTabNavigator();

function RequestsScreens() {
  	return (
    	<Tab.Navigator>
      		<Tab.Screen name="Recieved" component={InboundRequestScreen} />
      		<Tab.Screen name="Sent" component={OutboundboundRequestScreen} />
    	</Tab.Navigator>
  	);
}

const Stack = createNativeStackNavigator();

function App() {
  	let [fontsLoaded] = useFonts({ Sora_600SemiBold, Roboto_400Regular });
  	const [loaded, setLoaded] = useState(false);
  	const [defaultScreen, setDefaultScreen] = useState('LoginScreen');

  	useEffect(() => {
    	async function fetchValue() {      
      		const token = await getValueFor("token");
      		if (token) { setClientToken(token); setDefaultScreen('HomeScreen'); }

      		setLoaded(true);
    	}

    	fetchValue();
  	}, []);

  	if (!fontsLoaded || !loaded) {
    	return (
      		<AppLoading/>
    	);
  	}
  	else {
    	return (
      		<NavigationContainer>
      		  	<Stack.Navigator initialRouteName={defaultScreen}>
      		    	<Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      		    	<Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }}/>
      		    	<Stack.Screen name="HomeScreen" component={HomePage} options={{ headerShown: false }}/>
      		    	<Stack.Screen name="RequestsScreen" component={RequestsScreens} options={{ title: 'Requests' }}/>
      		    	<Stack.Screen name="PasscodeOTPScreen" component={PasscodeOTPScreen} options={{ title: 'Accept Address Request', headerBackVisible: false }}/>
					<Stack.Screen name="PasscodeCaptchaScreen" component={PasscodeCaptchaScreen} options={{ title: 'Accept Address Request', headerBackVisible: false }}/>
      		    	<Stack.Screen name="AddressScreen" component={AddressScreen} options={{ title: 'Edit Address', headerBackVisible: false }}/>
      		    	<Stack.Screen name="AddressSharingScreen" component={AddressSharingScreen} options={{ title: 'Linked Accounts' }}/> 
      		  	</Stack.Navigator>
      		</NavigationContainer>
    	);
  	}
}

export default App;