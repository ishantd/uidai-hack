import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
//import axiosInstance, { setClientToken } from '../axiosConfig';
//import axios from 'axios';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function Request(props) {
    return (
        <View style={styles.requestBox}>
            <View style={styles.requestIcon}/>
            <View style={styles.requestText}>
                <Text style={styles.requestTitle}>{props.name}</Text>
                <Text style={styles.requestSubtitle}>{props.aadhaar}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.requestTrash}>
                <Ionicons name={'trash'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </View>
    );
}

function HomePage(props) {
    const [aadhaar, setAadhaar] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [showBottomDrawer, setShowBottomDrawer] = useState(false);
    const [landlordNumber, setLandlordNumber] = useState('');

    const navigation = useNavigation();
    const focused = useIsFocused();

    useEffect(() => {
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.userBox}>
                <View style={styles.userIcon}/>
                <View style={styles.userText}>
                    <Text style={styles.userTitle}>{'Ishant Dahiya'}</Text>
                    <Text style={styles.userSubtitle}>{'XXXX-XXXX-35612'}</Text>
                </View>
            </View>
            <View style={styles.requestSection}>
                <Text style={styles.titleText}>{'Pending Requests'}</Text>
                <Request aadhaar={'XXXX-XXXX-45015'} name={'Kshitij Vikram Singh'}/>
                <Text style={styles.viewAllRequests} onPress={() => navigation.navigate("RequestsScreen")}>{'View All Requests'}</Text>
            </View>
            <Text style={styles.titleText}>{'Aadhaar Actions'}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setShowBottomDrawer(true)}>
                <Ionicons name={'location'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Request Address From Landlord'}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("OTPScreen") }}>
                <Ionicons name={'document-attach'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Update Address With Documents'}</Text>
            </TouchableOpacity>
            {
                showBottomDrawer ? 
                <View style={styles.cardBackground}>
                    <View style={styles.card}>
                        <TouchableOpacity activeOpacity={0.6} style={styles.closeIcon} onPress={() => setShowBottomDrawer(false)}>
                            <Ionicons name={'close'} size={24} color={'#000000'}/>
                        </TouchableOpacity>
                        <Text style={styles.cardTitle}>{'Request Address From Landlord'}</Text>
                        <Text style={styles.cardSubtitle}>{'Enter your Landlord\'s Phone Number to request their address.'}</Text>
                        <TextInput keyboardType='numeric' autoCapitalize='none' autoCorrect={false} maxLength={10} style={styles.inputBox} placeholder={"Phone Number"} value={landlordNumber} onChangeText={(text) => setLandlordNumber(text)}/>
                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { navigation.navigate("OTPScreen") }}>
                            <Ionicons name={'paper-plane'} size={24} color={'#FFFFFF'}/> 
                            <Text style={styles.buttonText}>{'Request Address'}</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null
            }
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#FFFFFF',
        paddingBottom: 48
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