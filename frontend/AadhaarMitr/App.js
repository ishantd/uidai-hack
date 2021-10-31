import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
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
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons'; 

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
	const [authenticated, setAuthenticated] = useState(true);

  	useEffect(() => {
    	async function fetchValue() {    
      		const token = await getValueFor("token");
      		if (token) { setClientToken(token); setDefaultScreen('HomeScreen'); }

      		setLoaded(true);
    	}

    	fetchValue();
  	}, []);

	const authenticateUser = async () => {
		const auth = await LocalAuthentication.authenticateAsync();
		console.log(auth);
		if (!auth.success) return;

		setAuthenticated(true);
	}

  	if (!fontsLoaded) {
    	return (
      		<AppLoading/>
    	);
  	}
	else if (!authenticated && loaded) {
		return (
			<View style={{ backgroundColor: '#000000', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 16 }}>
					<Text style={styles.cardTitle}>Please Authenticate</Text>
					<Text style={styles.cardSubtitle}>AadhaarMitr requires authentication to continue due to security reasons.</Text>
					<TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => authenticateUser()}>
						<MaterialIcons name="fingerprint" size={24} color={'#FFFFFF'}/>
                        <Text style={styles.buttonText}>{'Authenticate'}</Text>
                    </TouchableOpacity>
				</View>
			</View>
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

const styles = StyleSheet.create({
    button: { 
        backgroundColor: '#000000',

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',

        marginHorizontal: '5%',
        height: 64,

        borderRadius: 8,

        marginTop: 16,
        marginBottom: 16
    },

    buttonText: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',

        color: '#FFFFFF',
        marginLeft: 16,
    },

	cardTitle: {
        fontSize: 20,
        fontFamily: 'Sora_600SemiBold',

        marginHorizontal: 24,
        marginBottom: 16
    },

    cardSubtitle: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',

        marginHorizontal: 24,
		marginBottom: 16,
    },
});