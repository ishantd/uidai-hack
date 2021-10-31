import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, StatusBar, CameraRoll, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

function CameraPage(){
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [flashMode, setFlashMode] = useState('off');
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
            console.log(data);
        }
    }

    const toggleFlashMode = () => {
        flashMode === 'torch' ? setFlashMode('off') : setFlashMode('torch');
    }
  
    if (hasPermission === null) {
      return <View/>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera or microphone</Text>;
    }

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <Ionicons name={'close'} size={24} color={'#FFFFFF'}/> 
        </TouchableOpacity>
        <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={type} flashMode={flashMode} zoom={zoom}>
        <View style={styles.sliderContainer}>
            <MultiSlider smoothSnapped trackStyle={{height: 3, borderRadius: 2}} selectedStyle={{backgroundColor: '#FFFFFF'}} unselectedStyle={{backgroundColor: '#FFFFFF44'}} customMarker={() => { return <View style={styles.marker}/> }} onValuesChange={(values) => setZoom(values[0]/10)}/>
        </View>
        <View style={styles.faceArea}/>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => takePhoto()}>
                <Ionicons name={'camera'} size={32} color={'#FFFFFF'}/> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => toggleFlashMode()}>
                <Ionicons name={ flashMode === 'torch' ? 'flashlight' : 'flashlight-outline'} size={32} color={'#FFFFFF'}/> 
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
        justifyContent: 'space-between'
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
        backgroundColor: '#00000066',
        borderRadius: 32,
        padding: 8,
        margin: 16
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
});