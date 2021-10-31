import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { axiosUnauthorizedInstance, axiosInstance } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

function RequestAccepted(props) {
    const navigation = useNavigation();

    return (
        <View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center', height: 136 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.url }}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8 }]} onPress={() => props.accessAddress()}>
                    <Ionicons name={'lock-closed'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'Access Address'}</Text> 
                </TouchableOpacity>
            </View>
        </View>
    );
}

function RequestCompleted(props) {
    return (
        <View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center', height: 136, borderColor: '#3AA76D' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.url }}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8, backgroundColor: '#3AA76D' }]} onPress={() => props.accessAddress()}>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'Accessing Address'}</Text> 
                </TouchableOpacity>
            </View>
        </View>
    );
}

function RequestOutgoing(props) {
    const [viewAnimation, setViewAnimation] = useState(null);
    const deleteAnimation = { 0: { translateY: 0, opacity: 1 }, 0.5: { translateY: -5, opacity: 0.25 }, 1: { translateY: -10, opacity: 0 } };

    const showCancellationAlert = () => {
        Alert.alert('Alert', 'Are you sure you want to Delete this request? This action cannot be reversed.', [{ text: 'Delete', style: 'destructive', onPress: () => cancelRequest() }, { text: 'Cancel', style: 'default' }]);
    }

    const cancelRequest = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/cancel-request/',
            data: { requestId: props.id }
        }

        console.log(props.id);

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setViewAnimation(deleteAnimation); })
        .catch((error) => { console.error(error); });
    }

    return (
        <Animatable.View style={styles.requestBox} animation={viewAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}>
            <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.url }}/>
            <View style={styles.requestText}>
                <Text style={styles.requestTitle}>{props.name}</Text>
                <Text style={styles.requestSubtitle}>{props.phone}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.requestTrash} onPress={() => showCancellationAlert()}>
                <Ionicons name={'trash'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </Animatable.View>
    );
}

function RequestOutgoingNoUser(props) {
    const [viewAnimation, setViewAnimation] = useState(null);
    const deleteAnimation = { 0: { translateY: 0, opacity: 1 }, 0.5: { translateY: -5, opacity: 0.25 }, 1: { translateY: -10, opacity: 0 } };

    const showCancellationAlert = () => {
        Alert.alert('Alert', 'Are you sure you want to Delete this request? This action cannot be reversed.', [{ text: 'Delete', style: 'destructive', onPress: () => cancelRequest() }, { text: 'Cancel', style: 'default' }]);
    }

    const cancelRequest = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/cancel-request/',
            data: { requestId: props.id }
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setViewAnimation(deleteAnimation); })
        .catch((error) => { console.error(error); });
    }

    return (
        <Animatable.View style={styles.requestBox} animation={viewAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}>
            <View style={[styles.requestIcon, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name={'person'} size={36} color={'#FFFFFF'}/> 
            </View>
            <View style={styles.requestText}>
                <Text style={[styles.requestTitle, { letterSpacing: 3 }]}>{props.phone}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.requestTrash} onPress={() => showCancellationAlert()}>
                <Ionicons name={'trash'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </Animatable.View>
    );
}

function RequestIncoming(props) {
    const navigation = useNavigation();

    const [viewAnimation, setViewAnimation] = useState(null);
    const deleteAnimation = { 0: { translateY: 0, opacity: 1 }, 0.5: { translateY: -5, opacity: 0.25 }, 1: { translateY: -10, opacity: 0 } };

    const showCancellationAlert = () => {
        Alert.alert('Alert', 'Are you sure you want to Decline this request? This action cannot be reversed.', [{ text: 'Decline', style: 'destructive', onPress: () => cancelRequest() }, { text: 'Cancel', style: 'default' }]);
    }

    const cancelRequest = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/landlord-approves-request/',
            data: { requestId: props.id, requestStatus: 'decline' }
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setViewAnimation(deleteAnimation); })
        .catch((error) => { console.error(error); });
    }

    return (
        <Animatable.View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center', height: 136 }]} animation={viewAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.url }}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8 }]} onPress={() => navigation.navigate("PasscodeCaptchaScreen", { id: props.id })}>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'Accept'}</Text> 
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { backgroundColor: '#FFFFFF', borderBottomRightRadius: 8 }]} onPress={() => showCancellationAlert()}>
                    <Ionicons name={'close-circle'} size={24} color={'#000000'}/> 
                    <Text style={[styles.requestButtonText, { color: '#000000' }]}>{'Decline'}</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
}

function InboundRequestScreen(props) {
    const navigation = useNavigation();
    const focused = useIsFocused();

    const [inboundRequests, setInboundRequests] = useState();

    useEffect(() => {
        getRequestData();
    }, []);

    const getRequestData = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/address/send-request-to-landlord/?platform=mobile',
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setInboundRequests(response.data.data.requests_recieved); })
        .catch((error) => { console.error(error); });
    }

    return (
        inboundRequests ?
        <ScrollView style={styles.page}>
            <View style={styles.requestSection}>
                { inboundRequests.map((request, index) => request.request_approved ? null : <RequestIncoming key={index} name={request.name} phone={request.phone} url={request.photo} {...request}/>) }
            </View>
        </ScrollView> : 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size={'large'} color={'#000000'}/>
        </View>
    );
}

function OutboundboundRequestScreen(props) {
    const navigation = useNavigation();
    const focused = useIsFocused();

    const [showBottomDrawer, setShowBottomDrawer] = useState(false);
    const [passcode, setPasscode] = useState('');

    const transition = { 0: { opacity: 0 }, 1: { opacity: 1 } };
    const slideIn = { 0: { translateY: Dimensions.get('window').height }, 1: { translateY: 0 } };

    const transitionOut = { 0: { opacity: 0.4 }, 1: { opacity: 0 } };
    const slideOut = { 0: { translateY: 0 }, 1: { translateY: Dimensions.get('window').height } };

    const [backgroundAnimation, setBackgroundAnimation] = useState(transition);
    const [pageAnimation, setPageAnimation] = useState(slideIn);
    const [closing, setClosing] = useState(false);

    const [outboundRequests, setOutboundRequests] = useState();

    const [selectedRequest, setSelectedRequest] = useState();

    useEffect(() => {
        getRequestData();
    }, []);

    const getRequestData = () => {
        const requestOptions = {
            method: 'get',
            url: '/api/address/send-request-to-landlord/?platform=mobile',
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setOutboundRequests(response.data.data.requests_sent); })
        .catch((error) => { console.error(error); });
    }

    const verifyPasscode = () => {
        const requestOptions = {
            method: 'post',
            url: '/api/address/enter-passcode-and-get-address/',
            data: { requestId: selectedRequest, code: passcode }
        }

        axiosInstance(requestOptions)
        .then((response) => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setTimeout(() => navigation.navigate("AddressScreen", { data: response.data.data, requestId: selectedRequest }), 500); setPasscode(""); })
        .catch((error) => { console.error(error); });
    }

    return (
        outboundRequests ?
        <React.Fragment>
            <ScrollView style={styles.page}>
                <View style={styles.requestSection}>
                    { outboundRequests.map((request, index) => request.request_approved ? request.request_completed_by_tenant ? <RequestCompleted key={index} name={request.name} phone={request.phone} url={request.photo}/> : <RequestAccepted key={index} name={request.name} phone={request.phone} url={request.photo} accessAddress={() => { setSelectedRequest(request.id); setClosing(false); setPageAnimation(slideIn); setBackgroundAnimation(transition); setShowBottomDrawer(true); }} {...request}/> : request.name !== null ? <RequestOutgoing key={index} name={request.name} phone={request.phone} url={request.photo} {...request}/> : <RequestOutgoingNoUser key={index} phone={request.phone} {...request}/> ) }
                </View>
            </ScrollView>
            {
                showBottomDrawer ? 
                <React.Fragment>
                    <Animatable.View style={styles.cardBackground} animation={backgroundAnimation} duration={250} easing={'ease-out-quad'} useNativeDriver={true}/>
                    <Animatable.View style={styles.card} animation={pageAnimation} duration={400} easing={'ease-out-quad'} useNativeDriver={true} onAnimationEnd={() => { if (closing) setShowBottomDrawer(false) }}>
                        <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => { setClosing(true); setBackgroundAnimation(transitionOut); setPageAnimation(slideOut); setPasscode(""); }}>
                            <Ionicons name={'close'} size={24} color={'#000000'}/>
                        </TouchableOpacity>
                        <Text style={styles.cardTitle}>{'Enter Your Passcode'}</Text>
                        <Text style={styles.cardSubtitle}>{'Please enter the 4 digit passcode obtained from your Landlord to access their address.'}</Text>
                        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} secureTextEntry={true} maxLength={4} style={styles.inputBox} placeholder={"Enter Passcode"} value={passcode} onChangeText={(text) => setPasscode(text)}/>
                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => verifyPasscode()}>
                            <Ionicons name={'lock-open'} size={24} color={'#FFFFFF'}/> 
                            <Text style={styles.buttonText}>{'Proceed'}</Text>
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

export { InboundRequestScreen, OutboundboundRequestScreen, RequestOutgoing, RequestIncoming };

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 16
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
        position: 'absolute',
        top: 48,

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'column',

        marginHorizontal: '5%',
        width: '90%',

        marginTop: 16,
        marginBottom: 16
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

    requestBox: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0245CB',
        borderWidth: 2,

        justifyContent: 'flex-start',
        alignItems: 'center',

        flexDirection: 'row',

        marginHorizontal: '5%',
        width: '90%',
        height: 96,

        borderRadius: 8,

        marginTop: 16,
        marginBottom: 16
    },

    requestIcon: {
        backgroundColor: '#000000',
        borderRadius: 32,

        width: 64,
        height: 64,

        marginHorizontal: 16
    },

    requestText: {
        flex: 4
    },

    requestTitle: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',
    },

    requestSubtitle: {
        marginTop: 8,

        fontSize: 16,
        fontFamily: 'Roboto_400Regular',

        letterSpacing: 4,
    },

    requestTrash: {
        flex: 1, 
        height: 96,
        marginRight: -2,

        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,

        backgroundColor: '#0245CB',

        justifyContent: 'center',
        alignItems: 'center'
    },

    requestButtons: {
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: -18,
        marginLeft: -2, 
        marginRight: 0,
    },

    requestButton: {
        flex: 1,
        backgroundColor: '#0245CB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        paddingVertical: 8,
    },

    requestButtonText: {
        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',

        color: '#FFFFFF',
        marginLeft: 8,
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