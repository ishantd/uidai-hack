import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { axiosUnauthorizedInstance } from '../axiosInstance';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function RequestOutgoing(props) {
    return (
        <View style={styles.requestBox}>
            <View style={styles.requestIcon}/>
            <View style={styles.requestText}>
                <Text style={styles.requestTitle}>{props.name}</Text>
                <Text style={styles.requestSubtitle}>{props.phone}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.requestTrash}>
                <Ionicons name={'trash'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </View>
    );
}

function RequestIncoming(props) {
    const navigation = useNavigation();

    return (
        <View style={[styles.requestBox, { flexDirection: 'column', justifyContent: 'center', height: 136 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.requestIcon}/>
                <View style={styles.requestText}>
                    <Text style={styles.requestTitle}>{props.name}</Text>
                    <Text style={styles.requestSubtitle}>{props.phone}</Text>
                </View>
            </View>
            <View style={styles.requestButtons}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { borderBottomLeftRadius: 8 }]} onPress={() => navigation.navigate("PasscodeCaptchaScreen")}>
                    <Ionicons name={'checkmark-circle'} size={24} color={'#FFFFFF'}/>
                    <Text style={styles.requestButtonText}>{'Accept'}</Text> 
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={[styles.requestButton, { backgroundColor: '#FFFFFF', borderBottomRightRadius: 8 }]}>
                    <Ionicons name={'close-circle'} size={24} color={'#000000'}/> 
                    <Text style={[styles.requestButtonText, { color: '#000000' }]}>{'Decline'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function InboundRequestScreen(props) {
    const navigation = useNavigation();
    const focused = useIsFocused();

    useEffect(() => {
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.requestSection}>
                <RequestIncoming phone={'9643-099-621'} name={'Kshitij Vikram Singh'}/>
            </View>
        </View>
    );
}

function OutboundboundRequestScreen(props) {
    const navigation = useNavigation();
    const focused = useIsFocused();

    useEffect(() => {
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.requestSection}>
                <RequestOutgoing phone={'9643-099-621'} name={'Kshitij Vikram Singh'}/>
            </View>
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