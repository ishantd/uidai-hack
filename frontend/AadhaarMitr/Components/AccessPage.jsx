import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { axiosUnauthorizedInstance, axiosInstance, setClientToken  } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function AddressScreen(props) {
    const navigation = useNavigation();

    const [address, setAddress] = useState('House No. 448');

    return(
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
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
                <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/> 
                <Text style={styles.buttonText}>{'Save Address'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export { AddressScreen };

const styles = StyleSheet.create({
    page: {
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#FFFFFF',
        paddingTop: 48,
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
});