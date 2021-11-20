import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Toast, { DURATION } from 'react-native-easy-toast'

function AddressScreen(props) {
    const [showBottomDrawer, setShowBottomDrawer] = useState(false);
    const [OTP, setOTP] = useState('');
    const [aadhaar, setAadhaar] = useState('');

    const navigation = useNavigation();
    const focused = useIsFocused();
    const toastRef = useRef(null);

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

    const [careOf, setCareOf] = useState('');
    const [house, setHouse] = useState(props.route.params.data['@house']);
    const [street, setStreet] = useState(props.route.params.data['@street']);
    const [landmark, setLandmark] = useState(props.route.params.data['@lm']);
    const [vtc, setVtc] = useState(props.route.params.data['@vtc']);
    const [district, setDistrict] = useState(props.route.params.data['@dist']);
    const [pincode, setPincode] = useState(props.route.params.data['@pc']);
    const [state, setState] = useState(props.route.params.data['@state']);
    const [country, setCountry] = useState(props.route.params.data['@country']);

    const [screen, setScreen] = useState('Aadhaar');

    const [processingRequest, setProcessingRequest] = useState(false);
    const [txnId, setTxnId] = useState('');

    const [newAddressString, setNewAddressString] = useState('');
    const [oldAddressString, setOldAddressString] = useState('');

    useEffect(() => {
        let oldAddrStr = '';
        for (var key in props.route.params.data) {
            if (props.route.params.data.hasOwnProperty(key)) {
                oldAddrStr += props.route.params.data[key] + ' , ';
            }
        }
        setOldAddressString(oldAddrStr);
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
        if (aadhaar.length !== 12) {
            toastRef.current.show("Please enter valid Aadhaar number", 2500, () => {});
            return;
        }

        setProcessingRequest(true);

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/send-otp/',
            data: { uid: aadhaar }
        }

        axiosInstance(requestOptions)
        .then((response) => {
            setResendText(`Please Wait`);
            resendTimer = 60;
            setResendTrigger(!resendTrigger);
            setTxnId(response.data.txnId);
        })
        .then(() => { setScreen('OTP'); setProcessingRequest(false); })
        .catch((error) => { console.error(error); setProcessingRequest(false); toastRef.current.show("An error occurred", 2500, () => {}); });
    }

    const verifyOTP = () => {
        setProcessingRequest(true);

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/verify-otp/',
            data: { uid: aadhaar, txnId: txnId, otp: OTP }
        }

        axiosInstance(requestOptions)
        .then((response) => {
            if (response.data.status === 'okay') {
                saveAddress();
            }
        })
        .catch((error) => { console.error(error); setProcessingRequest(false); toastRef.current.show("Incorrect OTP entered.", 2500, () => {}); });
    }

    const saveAddress = () => {
        const addressObject = {
            '@co': careOf,
            '@house': house,
            '@street': street,
            '@lm': landmark,
            '@vtc': vtc,
            '@dist': district,
            '@pc': pincode,
            '@state': state,
            '@country': country
        };

        let newAddrStr = '';
        for (var key in addressObject) {
            if (addressObject.hasOwnProperty(key)) {
                newAddrStr += addressObject[key] + ' , ';
            }
        }
        setNewAddressString(newAddrStr);

        const requestOptions = {
            method: 'post',
            url: 'api/address/request-completed/',
            data: { requestId: props.route.params.requestId, addressData: addressObject, old: oldAddressString, new: newAddrStr }
        }

        axiosInstance(requestOptions)
        .then((response) => {
            setProcessingRequest(false);
        })
        .then(() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setTimeout(() => navigation.navigate("HomeScreen"), 500); })
        .catch((error) => { console.error(error); setProcessingRequest(false); toastRef.current.show("New Address too far from old address. Please enter an address in the same area.", 2500, () => {}); });
    }

    const resendOTP = () => {
        if (resendText !== 'Resend OTP') return;

        const requestOptions = {
            method: 'post',
            url: '/api/accounts/new-ekyc/send-otp/',
            data: { uid: aadhaar }
        }

        axiosInstance(requestOptions)
        .then((response) => {
            setResendText(`Please Wait`);
            resendTimer = 60;
            setResendTrigger(!resendTrigger);
            setTxnId(response.data.txnId);
        })
        .catch((error) => toastRef.current.show("An error occurred", 2500, () => {}));
    }

    return(
        <React.Fragment>
            <ScrollView contentContainerStyle={styles.page}>
                <Text style={styles.heading}>Modify Address</Text>
                <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.subheading}>{'You can make minor edits to your address if required.'}</Text>
                <TextInput style={styles.inputBox} value={house} onChangeText={(text) => setHouse(text)}/>
                <TextInput style={styles.inputBox} value={street} onChangeText={(text) => setStreet(text)}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={landmark.length > 0 ? ('Near ' + landmark) : ''} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={district + ', ' + vtc} editable={false}/>
                <TextInput style={[styles.inputBox, { color: '#00000088' }]} value={state + ', ' + pincode + ', ' + country} editable={false}/>
                <Text style={[styles.resendText, { color: '#FFFFFF' }]}>Resend OTP</Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.button}  onPress={() => { setClosing(false); setPageAnimation(slideIn); setBackgroundAnimation(transition); setShowBottomDrawer(true); }}>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                    <Text style={styles.buttonText}>{'Save Address'}</Text>
                </TouchableOpacity>
                <Toast ref={(toast) => toastRef.current = toast} style={{ backgroundColor: '#EE3B4E' }} textStyle={{ fontSize: 16, fontFamily: 'Roboto_400Regular', color: '#FFFFFF' }}/>
            </ScrollView>
            {
                showBottomDrawer ? 
                <React.Fragment>
                    <Animatable.View style={styles.cardBackground} animation={backgroundAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}/>
                    <Animatable.View style={styles.card} animation={pageAnimation} duration={400} easing={'ease-out-quad'} useNativeDriver={true} onAnimationEnd={() => { if (closing) setShowBottomDrawer(false); }}>
                        {
                            screen === 'Aadhaar' ? 
                            <React.Fragment>
                                <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setScreen('Aadhaar'); setOTP(); setAadhaar(); }}>
                                    <Ionicons name={'close'} size={24} color={'#000000'}/>
                                </TouchableOpacity>
                                <Text style={styles.cardTitle}>{'Authenticate Change'}</Text>
                                <Text style={styles.cardSubtitle}>{'Enter your Aadhaar Number to proceed with your address update request.'}</Text>
                                <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#FFFFFF'}/> 
                                <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={12} style={styles.inputBoxOTP} placeholder={"Aadhaar Number"} value={aadhaar} onChangeText={(text) => setAadhaar(text)}/>
                                <Text style={[styles.resendText, { opacity: 0 } ]}>{resendText}</Text>
                                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => sendOTP()}>
                                    {
                                        processingRequest ?
                                        <ActivityIndicator size="small" color="#FFFFFF"/> :
                                        <React.Fragment>
                                            <Ionicons name={'chevron-forward-circle'} size={24} color={'#FFFFFF'}/> 
                                            <Text style={styles.buttonText}>{'Proceed'}</Text>
                                        </React.Fragment>
                                    }
                                </TouchableOpacity>
                            </React.Fragment> :
                            <React.Fragment>
                                <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setScreen('Aadhaar'); setOTP(); setAadhaar(); }}>
                                    <Ionicons name={'close'} size={24} color={'#000000'}/>
                                </TouchableOpacity>
                                <Text style={styles.cardTitle}>{'Authenticate Change'}</Text>
                                <Text style={styles.cardSubtitle}>{'Enter the OTP you received on your phone to authenticate your address change.'}</Text>
                                <Ionicons name={'return-down-back'} style={{marginLeft: 'auto', marginRight: 24}} size={24} color={'#000000'} onPress={() => setScreen('Aadhaar')}/> 
                                <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={6} style={styles.inputBoxOTP} placeholder={"Enter OTP"} value={OTP} onChangeText={(text) => setOTP(text)}/>
                                <Text style={[styles.resendText, { opacity: resendText === 'Resend OTP' ? 1 : 0.6 } ]} onPress={() => resendOTP()}>{resendText}</Text>
                                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => verifyOTP()}>
                                    {
                                        processingRequest ?
                                        <ActivityIndicator size="small" color="#FFFFFF"/> :
                                        <React.Fragment>
                                            <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                                            <Text style={styles.buttonText}>{'Verify OTP'}</Text>
                                        </React.Fragment>
                                    }
                                </TouchableOpacity>
                            </React.Fragment>
                        }
                    </Animatable.View>
                </React.Fragment> : null
            }
        </React.Fragment>
    );
}

export { AddressScreen };

const styles = StyleSheet.create({
    page: {
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