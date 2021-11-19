import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, CameraRoll, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { axiosInstance } from '../axiosInstance';

function CameraPage(){
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const [camera, setCamera] = useState(null);
    const [zoom, setZoom] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePhoto = async () => {
        if (camera) {
            const data = await camera.takePictureAsync({ base64: true });
            console.log(data.base64);

            const requestOptions = {
                method: 'post',
                url: '/api/checkin/verify/',
                data: { image_b64: data.base64 }
            }
    
            axiosInstance(requestOptions)
            .then((response) => { console.log(response.data); navigation.navigate('QRScreen', { url: 'response.data.qrcode' }); })
            .catch((error) => { console.error(error); navigation.navigate('QRScreen', { url: '' }); });
        }
    }
  
    if (hasPermission === null) {
      return <View/>;
    }
    if (hasPermission === false) {
      return(
        <View style={styles.requestSectionEmpty}>
            <Text style={[styles.viewAllRequests, { color: '#00000088' }]}>Access to camera is required for Aadhaar CheckIn</Text>
        </View>
      );
    }

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <Ionicons name={'close'} size={24} color={'#FFFFFF'}/> 
        </TouchableOpacity>
        <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={type} zoom={zoom}>
        <View style={styles.sliderContainer}>
            <MultiSlider smoothSnapped trackStyle={{height: 3, borderRadius: 2}} selectedStyle={{backgroundColor: '#FFFFFF'}} unselectedStyle={{backgroundColor: '#FFFFFF44'}} customMarker={() => { return <View style={styles.marker}/> }} onValuesChange={(values) => setZoom(values[0]/10)}/>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => takePhoto()}>
                <Ionicons name={'camera'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
        </View>
        </Camera>
        </View>
    );
}

export default CameraPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    camera: {
        flex: 1,
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'center'
    },

    sliderContainer: {
        flex: 8,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    marker: {
        width: 20, 
        height: 20, 
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },

    button: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#000000AA',
        borderRadius: 32,
        padding: 16,
        width: 64,
        height: 64,
    },

    exitButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#00000066',
        borderRadius: 32,
        padding: 8,
        top: 16,
        left: 16,
        zIndex: 1
    },

    text: {
        fontSize: 18,
        color: 'white',
    },

    requestSectionEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
});