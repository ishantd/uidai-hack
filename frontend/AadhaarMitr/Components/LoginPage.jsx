import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function OTPScreen(props) {
    const [OTP, setOTP] = useState("");
    const [data, setData] = useState();
    const [mobile, setMobile] = useState();
    const [aadhaar, setAadhaar] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        setData(props.route.params.data);
        setMobile(props.route.params.mobile);
        setAadhaar(props.route.params.uid);
    }, []);

    const getEKYC = () => {
        console.log(data);
        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/get-ekyc/',
            data: { uid: aadhaar, mobileNumber: mobile, txnId: data.txnId, otp: OTP }
        }
        axiosUnauthorizedInstance(requestOptions).then((response) => { console.log(response.data); navigation.navigate("HomeScreen"); }).catch((error) => console.error(error));
    }

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>AadhaarMitr</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#000000'} onPress={() => navigation.navigate("LoginScreen")}/> 
        <Text style={styles.subheading}>{'Enter the OTP your received on your phone.'}</Text>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBox} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
        <Text style={styles.resendText}>Resend OTP</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => getEKYC()}>
            <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.buttonText}>{'Verify'}</Text>
        </TouchableOpacity>
      </View>
    );
}

function LoginScreen(props) {
    const [aadhaar, setAadhaar] = useState("");
    const [captchaImage, setCaptchaImage] = useState('');
    const [captcha, setCaptcha] = useState("");
    const [mobile, setMobile] = useState("");

    const [captchaTxnId, setCaptchaTxnId] = useState('');

    const navigation = useNavigation();
    /*const focused = useIsFocused();

    useEffect(() => {
        getCaptcha();
    }, []);

    useEffect(() => {
        if (focused) {
            getCaptcha();
            setCaptcha("");
        } 
    }, [focused]);*/

    /*const getCaptcha = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/accounts/ekyc/generate-captcha/',
        }
        axiosUnauthorizedInstance(requestOptions).then((response) => { setCaptchaImage(response.data.data.captchaBase64String); setCaptchaTxnId(response.data.data.captchaTxnId); }).catch((error) => console.error(error));
    }*/

    const sendOTP = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/send-otp/',
            data: { uid: aadhaar, mobileNumber: mobile/*, captchaTxnId: captchaTxnId, captchaValue: captcha*/ }
        }
        axiosUnauthorizedInstance(requestOptions).then((response) => { console.log(response.data); navigation.navigate("OTPScreen", { uid: aadhaar, data: response.data, mobile: mobile }); }).catch((error) => console.error(error));
    }

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>AadhaarMitr</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'} onPress={() => navigation.navigate("LoginScreen")}/> 
        <Text style={styles.subheading}>{'Enter your Aadhaar and Phone Number to continue.'}</Text>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={12} style={styles.inputBox} placeholder={"Aadhaar Number"} value={aadhaar} onChangeText={(text) => setAadhaar(text)}/>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={10} style={styles.inputBox} placeholder={"Phone Number"} value={mobile} onChangeText={(text) => setMobile(text)}/>
        {/*}<View style={styles.captcha}>
            <Image style={{ width: 180, height: 50, flex: 5, resizeMode: 'contain' }} source={{ uri: `data:image/png;base64,${captchaImage}` }}/>
            <TouchableOpacity activeOpacity={0.9} style={styles.refreshCaptcha} onPress={() => getCaptcha()}>
                <Ionicons name={'refresh-circle'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </View>
    <TextInput autoCapitalize='none' autoCorrect={false} style={styles.inputBox} placeholder={"Captcha"} value={captcha} onChangeText={(text) => setCaptcha(text)}/>*/}
        <Text style={[styles.resendText, { color: '#FFFFFF' }]}>Resend OTP</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => sendOTP()}>
            <Ionicons name={'send'} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.buttonText}>{'Send OTP'}</Text>
        </TouchableOpacity>
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