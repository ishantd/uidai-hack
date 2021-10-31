import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RequestIncoming, RequestOutgoing } from './RequestPages';
import * as Animatable from 'react-native-animatable';
import { axiosInstance } from '../axiosInstance';
import * as SecureStore from 'expo-secure-store';

async function clear(key) {
    await SecureStore.deleteItemAsync(key);
}

function HomePage(props) {
    const [showBottomDrawer, setShowBottomDrawer] = useState(false);
    const [landlordNumber, setLandlordNumber] = useState('');

    const navigation = useNavigation();
    const focused = useIsFocused();

    const transition = { 0: { opacity: 0 }, 1: { opacity: 1 } };
    const slideIn = { 0: { translateY: Dimensions.get('window').height }, 1: { translateY: 0 } };

    const transitionOut = { 0: { opacity: 0.4 }, 1: { opacity: 0 } };
    const slideOut = { 0: { translateY: 0 }, 1: { translateY: Dimensions.get('window').height } };

    const [backgroundAnimation, setBackgroundAnimation] = useState(transition);
    const [pageAnimation, setPageAnimation] = useState(slideIn);
    const [closing, setClosing] = useState(false);

    const [userData, setUserData] = useState();
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        getProfileData();
        getRequestData();
    }, []);

    useEffect(() => {
        if (focused) {
            getRequestData();
        }
    }, [focused]);

    const getProfileData = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/accounts/profile/',
        }

        axiosInstance(requestOptions)
        .then((response) => {
            console.log(response.data);
            setUserData(response.data.profile_data);
        })
        .catch((error) => { console.error(error); });
    }

    const getRequestData = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/address/send-request-to-landlord/?platform=mobile',
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setPendingRequests(response.data.data.requests_recieved); })
        .catch((error) => { console.error(error); });
    }

    const sendLandlordRequest = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/send-request-to-landlord/',
            data: { mobileNumber: landlordNumber },
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); })
        .catch((error) => { console.error(error); });
    }

    return (
        userData ? 
        <React.Fragment>
        <ScrollView style={styles.page} contentContainerStyle={styles.pageContainer}>
            <View style={styles.userBox}>
                <Image style={styles.userIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + userData.img_url }}/>
                <View style={styles.userText}>
                    <Text style={styles.userTitle}>{userData.name}</Text>
                    <Text style={styles.userSubSubtitle}>{userData.mobile_number}</Text>
                    <Text style={styles.userSubtitle}>{`XXXX-XXXX-${userData.masked_aadhaar}`}</Text>
                </View>
            </View>
            <View style={styles.requestSection}>
                <Text style={styles.titleText}>{'Pending Requests'}</Text>
                <ScrollView style={{ maxHeight: 160 }}>
                    { pendingRequests.map((request, index) => request.request_approved ? null : <RequestIncoming key={index} name={request.name} phone={request.phone} url={request.photo} {...request}/>) }
                </ScrollView>
                <Text style={styles.viewAllRequests} onPress={() => navigation.navigate("RequestsScreen")}>{'View All Requests'}</Text>
            </View> 
            <Text style={styles.titleText}>{'Aadhaar Services'}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { setClosing(false); setPageAnimation(slideIn); setBackgroundAnimation(transition); setShowBottomDrawer(true); }}>
                <Ionicons name={'location'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Request Address'}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("AddressSharingScreen") }}>
                <Ionicons name={'person'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Accounts Linked'}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={[styles.button, { backgroundColor: '#0245CB', marginTop: 64, }]} onPress={() => { clear('token'); navigation.navigate("LoginScreen"); }}>
                <Ionicons name={'log-out'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Log Out'}</Text>
            </TouchableOpacity>
        </ScrollView>
        {
            showBottomDrawer ? 
            <React.Fragment>
                <Animatable.View style={styles.cardBackground} animation={backgroundAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}/>
                <Animatable.View style={styles.card} animation={pageAnimation} duration={400} easing={'ease-out-quad'} useNativeDriver={true} onAnimationEnd={() => { if (closing) setShowBottomDrawer(false); }}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setLandlordNumber(); }}>
                        <Ionicons name={'close'} size={24} color={'#000000'}/>
                    </TouchableOpacity>
                    <Text style={styles.cardTitle}>{'Request Address From Landlord'}</Text>
                    <Text style={styles.cardSubtitle}>{'Enter your Landlord\'s Phone Number to request their address.'}</Text>
                    <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={10} style={styles.inputBox} placeholder={"Phone Number"} value={landlordNumber} onChangeText={(text) => setLandlordNumber(text)}/>
                    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); sendLandlordRequest(); setLandlordNumber(); }}>
                        <Ionicons name={'paper-plane'} size={24} color={'#FFFFFF'}/> 
                        <Text style={styles.buttonText}>{'Request Address'}</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </React.Fragment> : null
        }
        </React.Fragment> : 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size={'large'} color={'#000000'}/>
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
    },

    pageContainer: {
        paddingTop: 32,
        paddingBottom: 32
    },

    card: {
        position: 'absolute',
        bottom: 0,

        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,

        width: Dimensions.get('window').width,

        backgroundColor: '#FFFFFF',

        paddingBottom: 32,
        paddingTop: 16
    },

    cardBackground: {
        position: 'absolute',

        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        
        top: 0,
        backgroundColor: '#000000AA'
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

        marginHorizontal: 24
    },

    closeIcon: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginRight: 16, 
        marginBottom: 16
    },

    userBox: {
        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'column',

        marginHorizontal: '5%',
        width: '90%',

        marginTop: 48,
        marginBottom: 48
    },

    userText: {
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 16,
    },

    userIcon: {
        backgroundColor: '#000000',
        borderRadius: 64,

        width: 128,
        height: 128,

        marginHorizontal: 12
    },

    userTitle: {
        fontSize: 20,
        fontFamily: 'Sora_600SemiBold',
    },

    userSubtitle: {
        marginTop: 8,

        fontSize: 18,
        fontFamily: 'Roboto_400Regular',

        letterSpacing: 4,
    },

    userSubSubtitle: {
        marginTop: 8,

        fontSize: 16,
        fontFamily: 'Roboto_400Regular',

        color: '#0245CB',

        letterSpacing: 4
    },

    titleText: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',

        color: '#000000',
        marginLeft: '10%',

        marginBottom: 16
    },

    viewAllRequests: {
        fontSize: 16,
        fontFamily: 'Sora_600SemiBold',

        color: '#0245CB',
        marginLeft: 'auto',
        marginRight: 'auto',

        marginBottom: 16,
        marginTop: 12
    },

    button: { 
        backgroundColor: '#000000',

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',

        marginHorizontal: '5%',
        width: '90%',
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

    requestSection: {
        marginBottom: 32
    },

    inputBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000000',

        marginRight: 24, 
        marginLeft: 24,

        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        color: "#000000",

        letterSpacing: 3,
        
        paddingTop: 16, 
        paddingBottom: 16,
        paddingLeft: 24,

        height: 64,

        marginTop: 32,
    },
});