import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function PasscodeOTPScreen(props) {
    const [OTP, setOTP] = useState("");
    const [aadhaar, setAadhaar] = useState();
    const [resendText, setResendText] = useState();
    const [resendTrigger, setResendTrigger] = useState(false);
    const [passcode, setPasscode] = useState();
    const [transactionId, setTransactionId] = useState();

    let resendTimer = 60;

    const navigation = useNavigation();

    useEffect(() => {
        setOTP();
        setTransactionId(props.route.params.data.data.txnId);
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
            url: '/api/accounts/ekyc/send-otp/', // NEW URL => 'api/accounts/new-ekyc/send-otp/
            // New Data => only UID
            data: { uid: props.route.params.aadhaar, captchaTxnId: props.route.params.captchaTxnId, captchaValue: props.route.params.captcha }
            // success if status==okay, returns txnId, aadhaar_api_response as data
        }

        axiosInstance(requestOptions)
        .then((response) => {
            setResendText(`Please Wait`);
            resendTimer = 60;
            setResendTrigger(!resendTrigger);
            setTransactionId(response.data.data.txnId);
        })
        .catch((error) => console.error(error));
    }

    const getEKYC = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/accounts/ekyc/get-ekyc/', // NEW URL => 'api/accounts/new-ekyc/get-ekyc/
            // new data : uid, txnId, otp, request_id
            data: { request_id: props.route.params.id, uid: props.route.params.aadhaar, otp: OTP, txnId: transactionId, shareCode: passcode }
            
        }

        axiosInstance(requestOptions)
        .then((response) => {
            console.log(response);
            if (response.data.status === 'okay') clearRequest();
        })
        .catch((error) => console.error(error));
    }

    const clearRequest = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/landlord-approves-request/',
            data: { requestId: props.route.params.id, requestStatus: 'accept' }
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); navigation.navigate('HomeScreen'); })
        .catch((error) => { console.error(error); });
    }

    return (
      <View style={styles.page}>
        <Text style={styles.heading}>Create A Passcode</Text>
        <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
        <Text style={styles.subheading}>{'Please create a 4 digit passcode to share your address securely.'}</Text>
        <TextInput keyboardType='numeric' secureTextEntry={true} autoCapitalize='none' autoCorrect={false} autoFocus={true} maxLength={4} style={styles.inputBox} placeholder={"Create Passcode"} value={passcode} onChangeText={(text) => setPasscode(text)}/>
        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBox} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
        <Text style={[styles.resendText, { opacity: resendText === 'Resend OTP' ? 1 : 0.6 } ]} onPress={() => sendOTP()}>{resendText}</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => getEKYC()}>
            <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.buttonText}>{'Verify'}</Text>
        </TouchableOpacity>
      </View>
    );
}

function PasscodeCaptchaScreen(props) {
    const [aadhaar, setAadhaar] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaTxnId, setCaptchaTxnId] = useState("");
    const [captchaImage, setCaptchaImage] = useState();

    const navigation = useNavigation();

    const [processingRequest, setProcessingRequest] = useState(false);

    useEffect(() => { getCaptcha() }, []);

    const getCaptcha = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/accounts/ekyc/generate-captcha/',
        }                   

        axiosInstance(requestOptions)
        .then((response) => { 
            setCaptchaImage(response.data.data.captchaBase64String);
            setCaptchaTxnId(response.data.data.captchaTxnId);
        })
        .catch((error) => console.error(error));
    }

    const sendOTP = () => {
        setProcessingRequest(true);

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/ekyc/send-otp/',
            data: { uid: aadhaar, captchaTxnId: captchaTxnId, captchaValue: captcha }
        }

        axiosInstance(requestOptions)
        .then((response) => {
            console.log(response.data);
            navigation.navigate("PasscodeOTPScreen", { aadhaar: aadhaar, data: response.data, captchaTxnId: captchaTxnId, captcha: captcha, id: props.route.params.id });
            setProcessingRequest(false);
        })
        .catch((error) => { console.error(error); setProcessingRequest(false); });
    }

    return (
        <View style={styles.page}>
            <Text style={styles.heading}>Authenticate Yourself</Text>
            <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
            <Text style={styles.subheading}>{'Enter your Aadhaar Number to continue.'}</Text>
            <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={12} style={styles.inputBox} placeholder={"Aadhaar Number"} value={aadhaar} onChangeText={(text) => setAadhaar(text)}/>
            <View style={styles.captcha}>
                <Image style={{ width: 180, height: 50, flex: 5, resizeMode: 'contain' }} source={{ uri: `data:image/png;base64,${captchaImage}` }}/>
                <TouchableOpacity activeOpacity={0.9} style={styles.refreshCaptcha} onPress={() => getCaptcha()}>
                    <Ionicons name={'refresh-circle'} size={32} color={'#FFFFFF'}/> 
                </TouchableOpacity>
            </View>
            <TextInput autoCapitalize='none' autoCorrect={false} style={styles.inputBox} placeholder={"Captcha"} value={captcha} onChangeText={(text) => setCaptcha(text)}/>
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
        </View>
    );
}

export { PasscodeOTPScreen, PasscodeCaptchaScreen };

const styles = StyleSheet.create({
    page: {
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