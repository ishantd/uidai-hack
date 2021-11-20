import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AadhaarLogo from '../Images/Aadhaar';
import messaging from '@react-native-firebase/messaging';
import Toast, { DURATION } from 'react-native-easy-toast'

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function clear(key) {
    await SecureStore.deleteItemAsync(key);
}

function OTPScreen(props) {
    const [OTP, setOTP] = useState("");
    const [data, setData] = useState();
    const [aadhaar, setAadhaar] = useState();
    const [resendText, setResendText] = useState();
    const [resendTrigger, setResendTrigger] = useState(false);
    let resendTimer = 60;

    const [processingRequest, setProcessingRequest] = useState(false);

    const navigation = useNavigation();
    const toastRef = useRef(null);

    useEffect(() => {
        setData(props.route.params.data);
        setAadhaar(props.route.params.aadhaar);
    }, []);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (resendTimer > 1 && resendText !== "Resend OTP") {
                resendTimer--;
                setResendText(`Please Wait`);
            }
            else {
                setResendText("Resend OTP");
                clearInterval(timerInterval);
            }
        }, 1000);
    }, [resendTrigger]);

    const sendOTP = () => {
        if (resendText !== 'Resend OTP') return;

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/send-otp/',
            data: { uid: aadhaar }
        }

        axiosUnauthorizedInstance(requestOptions)
        .then((response) => {
            setResendText(`Please Wait`);
            resendTimer = 60;
            setResendTrigger(!resendTrigger);
        })
        .catch((error) => console.error(error));
    }

    const getEKYC = () => {
        if (OTP.length !== 6) {
            toastRef.current.show("Please enter a valid OTP", 2500, () => {});
            return;
        }

        setProcessingRequest(true);

        delete axiosUnauthorizedInstance.defaults.headers.common['Authorization'];
        delete axiosInstance.defaults.headers.common['Authorization'];
        clear('token');        

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/get-ekyc/',
            data: { uid: aadhaar, txnId: data.txnId, otp: OTP },
        }
        axiosUnauthorizedInstance(requestOptions).then((response) => { save("token", response.data.token); setClientToken(response.data.token); }).then(() => { getAndSetMessagingToken(); }).catch((error) => { console.error(error, "Error in getEKYC"); toastRef.current.show("Please check your OTP and try again", 2500, () => {}); setProcessingRequest(false); });
    }

    async function getAndSetMessagingToken() {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-device/',
            data: { device_id: token }
        }
        
        axiosInstance(requestOptions)
        .then((response) => { navigation.navigate("HomeScreen"); })
        .catch((error) => { console.error(error, "Error in set token"); toastRef.current.show("An unknown error occured", 2500, () => {});  });
    }

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>AadhaarMitr</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#000000'} onPress={() => navigation.navigate("LoginScreen")}/> 
        <Text style={styles.subheading}>{'Enter the OTP your received on your phone.'}</Text>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBox} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
        <Text style={[styles.resendText, { opacity: resendText === 'Resend OTP' ? 1 : 0.6 } ]} onPress={() => sendOTP()}>{resendText}</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => getEKYC()}>
            {
                processingRequest ?
                <ActivityIndicator size="small" color="#FFFFFF"/> :
                <React.Fragment>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                    <Text style={styles.buttonText}>{'Verify'}</Text>
                </React.Fragment>
            }
        </TouchableOpacity>
        <Toast ref={(toast) => toastRef.current = toast} style={{ backgroundColor: '#EE3B4E' }} textStyle={{ fontSize: 16, fontFamily: 'Roboto_400Regular', color: '#FFFFFF' }}/>
      </View>
    );
}

function LoginScreen(props) {
    const [aadhaar, setAadhaar] = useState("");

    const navigation = useNavigation();
    const toastRef = useRef(null);

    const [processingRequest, setProcessingRequest] = useState(false);

    const sendOTP = () => {
        if (aadhaar.length !== 12) {
            toastRef.current.show("Please enter a valid Aadhaar Number", 2500, () => {});
            return;
        }

        setProcessingRequest(true);

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/send-otp/',
            data: { uid: aadhaar }
        }

        axiosUnauthorizedInstance(requestOptions)
        .then((response) => {
            console.log(response.data);
            setAadhaar("");
            navigation.navigate("OTPScreen", { aadhaar: aadhaar, data: response.data });
            setProcessingRequest(false);
        })
        .catch((error) => { console.error(error); setProcessingRequest(false); toastRef.current.show("An error occured while attempting to send OTP", 2500, () => {}); });
    }

    return (
        <View style={styles.page}>
            <View style={styles.logoBackground}>
                <Image style={styles.tinyLogo} resizeMode={'contain'} source={require('../Images/Aadhar-White.png')}/>
            </View>
            <Text style={styles.heading}>AadhaarMitr</Text>
            <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.subheading}>{'Enter your Aadhaar Number to continue.'}</Text>
            <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={12} style={styles.inputBox} placeholder={"Aadhaar Number"} value={aadhaar} onChangeText={(text) => setAadhaar(text)}/>
            <Text style={[styles.resendText, { color: '#FFFFFF' }]}>Resend OTP</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => sendOTP()}>
                {
                    processingRequest ?
                    <ActivityIndicator size="small" color="#FFFFFF"/> :
                    <React.Fragment>
                        <Ionicons name={'send'} size={24} color={'#FFFFFF'}/> 
                        <Text style={styles.buttonText}>{'Send OTP'}</Text>
                    </React.Fragment>
                }
            </TouchableOpacity>
            <Toast ref={(toast) => toastRef.current = toast} style={{ backgroundColor: '#EE3B4E' }} textStyle={{ fontSize: 16, fontFamily: 'Roboto_400Regular', color: '#FFFFFF' }}/>
        </View>
    );
}

export { LoginScreen, OTPScreen };

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#FFFFFF'
    },

    logoBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',

        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').width / 3,
        borderRadius: Dimensions.get('window').width / 6,

        marginBottom: 48,
        marginHorizontal: Dimensions.get('window').width / 3
    },  

    tinyLogo: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').width / 4,
    },

    heading: {
        fontSize: Dimensions.get('window').width / 10,
        fontFamily: 'Sora_600SemiBold',
        marginHorizontal: 24,
    },

    subheading: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',

        marginHorizontal: 24,
        marginVertical: 12,
    },

    resendText: {
        fontSize: 14,
        fontFamily: 'Sora_600SemiBold',

        marginLeft: 'auto',
        marginRight: 36,
        marginVertical: 12,

        color: '#0245CB'
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

        marginTop: 48,
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

        marginBottom: '30%'
    },

    buttonText: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',

        color: '#FFFFFF',
        marginLeft: 16,
    },

    captcha: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000000',

        height: 64,

        marginHorizontal: '5%',
        width: '90%',

        borderRadius: 8,

        marginTop: 32,
        marginBottom : -16,

        justifyContent: 'center',
        alignItems: 'flex-start',

        flexDirection: 'row'
    },

    refreshCaptcha: {
        flex: 1, 
        height: 64,
        marginRight: -2,
        marginTop: -2,

        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,

        backgroundColor: '#0245CB',

        justifyContent: 'center',
        alignItems: 'center'
    },
});