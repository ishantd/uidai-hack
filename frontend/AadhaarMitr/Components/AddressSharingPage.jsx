import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { axiosInstance } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

function RequestAccepted(props) {
    const [expanded, setExpanded] = useState(false);

    const [addressLine1, setAddressLine1] = useState();
    const [addressLine2, setAddressLine2] = useState();
    const [addressLine3, setAddressLine3] = useState();

    useEffect(() => {
        setAddressLine1(props.address['@house'] + ' ' + props.address['@street'] + ' ' + ( props.address['@landmark'].length > 0 ? 'Near ' + props.address['@landmark'] : null ));
        setAddressLine2(props.address['@subdist'] + ' ' + props.address['@dist'] + ' ' + props.address['@vtc']);
        setAddressLine3(props.address['@pc'] + ' ' + props.address['@state'] + ' ' + props.address['@country']);
    }, []);

    return (
        !expanded ?
        <View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.photo }}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]} onPress={() => setExpanded(true)}>
                    <Ionicons name={'eye'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'View Address'}</Text> 
                </TouchableOpacity>
            </View>
        </View> : 
        <View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.requestIcon} source={{ uri: 'http://127.0.0.1:8000'/*'https://aadhaarmitr.tech'*/ + props.photo }}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                    <View style={{ marginVertical: 12 }}>
                        <Text style={styles.requestAddress}>{addressLine1}</Text>
                        <Text style={styles.requestAddress}>{addressLine2}</Text>
                        <Text style={styles.requestAddress}>{addressLine3}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]} onPress={() => setExpanded(false)}>
                    <Ionicons name={'eye-off'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'Hide Address'}</Text> 
                </TouchableOpacity>
            </View>
        </View>
    );
}

function AddressSharingScreen(props) {
    const [accounts, setAccounts] = useState();

    useEffect(() => {
        const requestOptions = {
            method: 'get',
            url: '/api/accounts/linked/',
        }

        axiosInstance(requestOptions)
        .then((response) => { console.log(response); setAccounts(response.data.data); })
        .catch((error) => { console.error(error); });
    }, []);

    return (
        accounts ? 
        <View style={styles.page}>
            {
                accounts.length > 0 ? 
                <View style={styles.requestSection}>
                    { accounts.map((account, index) => <RequestAccepted key={index} {...account}/>) }
                </View> :
                <View style={styles.requestSectionEmpty}>
                    <Text style={[styles.viewAllRequests, { color: '#00000088' }]}>No Accounts Linked To Your Address</Text>
                </View>
            }
        </View> : 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <ActivityIndicator size={'large'} color={'#000000'}/>
        </View>
    );
}

export default AddressSharingScreen;

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

    requestSectionEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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

        borderRadius: 8,

        marginTop: 16,
        marginBottom: 16
    },

    requestIcon: {
        backgroundColor: '#000000',
        borderRadius: 32,

        width: 64,
        height: 64,

        marginHorizontal: 16,
        marginTop: 16
    },

    requestText: {
        flex: 4
    },

    requestTitle: {
        marginTop: 16,

        fontSize: 18,
        fontFamily: 'Sora_600SemiBold',
    },

    requestSubtitle: {
        marginTop: 8,

        fontSize: 16,
        fontFamily: 'Roboto_400Regular',

        letterSpacing: 4,
    },

    requestAddress: {
        marginTop: 8,

        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
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
        marginRight: -2,
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