import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

function AddressScreen(props) {
    const [address, setAddress] = useState('House No. 448');

    const [showBottomDrawer, setShowBottomDrawer] = useState(false);
    const [OTP, setOTP] = useState('');

    const navigation = useNavigation();
    const focused = useIsFocused();

    const transition = { 0: { opacity: 0 }, 1: { opacity: 1 } };
    const slideIn = { 0: { translateY: Dimensions.get('window').height }, 1: { translateY: 0 } };

    const transitionOut = { 0: { opacity: 0.4 }, 1: { opacity: 0 } };
    const slideOut = { 0: { translateY: 0 }, 1: { translateY: Dimensions.get('window').height } };

    const [backgroundAnimation, setBackgroundAnimation] = useState(transition);
    const [pageAnimation, setPageAnimation] = useState(slideIn);
    const [closing, setClosing] = useState(false);

    const [resendText, setResendText] = useState();
    const [resendTrigger, setResendTrigger] = useState(false);
    let resendTimer = 60;

    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (resendTimer > 1 && resendText !== "Resend OTP") {
                resendTimer--;
                setResendText(`Resend OTP (${resendTimer} Seconds)`);
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
            data: { uid: '999971650886' }
        }

        axiosUnauthorizedInstance(requestOptions)
        .then((response) => {
            setResendText(`Resend OTP (${resendTimer} Seconds)`);
            resendTimer = 60;
            setResendTrigger(!resendTrigger);
        })
        .catch((error) => console.error(error));
    }

    return(
        <React.Fragment>
            <ScrollView style={styles.page}>
                <Text style={styles.heading}>Modify Address</Text>
                <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.subheading}>{'You can make minor edits to your address if required.'}</Text>
                <TextInput style={styles.inputBox} value={address} onChangeText={(text) => setAddress(text)}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={'Pocket - 1, Paschim Puri'} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={'Near Ration Office, West Delhi'} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={'New Delhi, Delhi'} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={'India'} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={'110063'} editable={false}/>
                <Text style={[styles.resendText, { color: '#FFFFFF' }]}>Resend OTP</Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.button}  onPress={() => { setClosing(false); setPageAnimation(slideIn); setBackgroundAnimation(transition); setShowBottomDrawer(true); }}>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                    <Text style={styles.buttonText}>{'Save Address'}</Text>
                </TouchableOpacity>
            </ScrollView>
            {
                showBottomDrawer ? 
                <React.Fragment>
                    <Animatable.View style={styles.cardBackground} animation={backgroundAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}/>
                    <Animatable.View style={styles.card} animation={pageAnimation} duration={400} easing={'ease-out-quad'} useNativeDriver={true} onAnimationEnd={() => { if (closing) setShowBottomDrawer(false); }}>
                        <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); }}>
                            <Ionicons name={'close'} size={24} color={'#000000'}/>
                        </TouchableOpacity>
                        <Text style={styles.cardTitle}>{'Authenticate Change'}</Text>
                        <Text style={styles.cardSubtitle}>{'Enter the OTP you received on your phone to authenticate your address change.'}</Text>
                        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBoxOTP} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
                        <Text style={[styles.resendText, { opacity: resendText === 'Resend OTP' ? 1 : 0.6 } ]} onPress={() => sendOTP()}>{resendText}</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setTimeout(() => navigation.navigate("HomeScreen"), 500); }}>
                            <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                            <Text style={styles.buttonText}>{'Verify Update'}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </React.Fragment> : null
            }
        </React.Fragment>
    );
}

export { AddressScreen };

const styles = StyleSheet.create({
    page: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#FFFFFF',
        paddingTop: 48,
    },

    pageOTP: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#FFFFFF'
    },

    heading: {
        fontSize: 32,
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
        
        paddingTop: 16, 
        paddingBottom: 16,
        paddingLeft: 24,

        height: 64,

        marginTop: 16
    },

    inputBoxOTP: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000000',

        marginRight: 24, 
        marginLeft: 24,

        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        color: "#000000",
        
        paddingTop: 16, 
        paddingBottom: 16,
        paddingLeft: 24,

        height: 64,

        marginTop: 16,

        letterSpacing: 4
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

        marginBottom: '15%'
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

    card: {
        position: 'absolute',
        bottom: 0,

        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,

        width: Dimensions.get('window').width,

        backgroundColor: '#FFFFFF',
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
});