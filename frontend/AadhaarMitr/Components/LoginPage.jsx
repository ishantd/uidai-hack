import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
//import axiosInstance, { setClientToken } from '../axiosConfig';
//import axios from 'axios';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function SelectionScreen(props) {
    const navigation = useNavigation();

    return (
        <View style={styles.page}>
          <Text style={styles.heading}>AadhaarMitr</Text>
          <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'} onPress={() => navigation.navigate("LoginScreen")}/> 
          <Text style={styles.subheading}>{'Select how you would like to use the app.'}</Text>
          <TouchableOpacity activeOpacity={0.8} style={[styles.button, { marginBottom: 16 }]} onPress={() => { navigation.navigate("AppScreens") }}>
              <Ionicons name={'body'} size={24} color={'#FFFFFF'}/> 
              <Text style={styles.buttonText}>{'I am a tenant'}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("AppScreens") }}>
              <Ionicons name={'business'} size={24} color={'#FFFFFF'}/> 
              <Text style={styles.buttonText}>{'I am a landlord'}</Text>
          </TouchableOpacity>
        </View>
    );
}

function OTPScreen(props) {
    const [OTP, setOTP] = useState("");

    const navigation = useNavigation();
    const focused = useIsFocused();

    useEffect(() => {
        //generateOTP();
        //setClientToken();
    }, []);

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>AadhaarMitr</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#000000'} onPress={() => navigation.navigate("LoginScreen")}/> 
        <Text style={styles.subheading}>{'Enter the OTP your received on your phone.'}</Text>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBox} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
        <Text style={styles.resendText}>Resend OTP</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("SelectionScreen") }}>
            <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.buttonText}>{'Verify'}</Text>
        </TouchableOpacity>
      </View>
    );
}

function LoginScreen(props) {
    const [aadhaar, setAadhaar] = useState("");
    const [captcha, setCaptcha] = useState("");

    const navigation = useNavigation();
    const focused = useIsFocused();

    useEffect(() => {
        //generateOTP();
        //setClientToken();
    }, []);

    const generateOTP = () => {
        const requestOptions = {
            method: 'post',
            url: `/accounts/send-phone-otp/`,
            data: { 'phone': '9643099621' }
        }
        axiosInstance(requestOptions).then((response) => console.log(response.data)).catch((error) => console.log(error));
    }

    const verifyOTP = () => {
        const requestOptions = {
            method: 'post',
            url: `/accounts/verify-phone-otp/`,
            data: { 'phone': '9643099621', 'otp': '683874' }
        }
        axiosInstance(requestOptions).then((response) => console.log(response.data)).catch((error) => console.log(error));
    }

    const checkTokenDummy = () => {
        const requestOptions = {
            method: 'post',
            url: `/accounts/auth-api-test/`,
        }
        axiosInstance(requestOptions).then((response) => console.log(response.data)).catch((error) => console.log(error));
    }

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>AadhaarMitr</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'} onPress={() => navigation.navigate("LoginScreen")}/> 
        <Text style={styles.subheading}>{'Enter the OTP your received on your phone.'}</Text>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={10} style={styles.inputBox} placeholder={"Aadhaar Number"} value={aadhaar} onChangeText={(text) => setAadhaar(text)}/>
        {/*<View style={styles.captcha}/>
        <TextInput autoCapitalize='none' autoCorrect={false} style={styles.inputBox} placeholder={"Captcha"} value={captcha} onChangeText={(text) => setCaptcha(text)}/>*/}
        <Text style={[styles.resendText, { color: '#FFFFFF' }]}>Resend OTP</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("OTPScreen") }}>
            <Ionicons name={'send'} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.buttonText}>{'Send OTP'}</Text>
        </TouchableOpacity>
      </View>
    );
}

export { LoginScreen, OTPScreen, SelectionScreen };

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

        marginBottom: '50%'
    },

    buttonText: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',

        color: '#FFFFFF',
        marginLeft: 16,
    },

    captcha: {
        backgroundColor: '#000000',

        height: 64,

        marginHorizontal: '5%',
        width: '90%',

        borderRadius: 8,

        marginTop: 32,
        marginBottom : -16
    }
});