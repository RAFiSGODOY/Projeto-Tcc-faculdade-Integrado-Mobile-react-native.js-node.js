import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export default function Home() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
           <StatusBar translucent backgroundColor="transparent" />
        </View>
    );
};

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        zIndex: 0,
    },
    NomeUsuario: {
        fontSize: 22,
        width: '65%',
        height: '10%',
        fontWeight: '400',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 5 },
        textShadowRadius: 7,
        marginTop: 15,
        alignSelf: 'center',
        textAlign: 'left',
        color: "#ffff",
        zIndex: 1,
    },
    containerLogo: {
        flex: 2.5,
        backgroundColor: '#ffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm: {
        backgroundColor: '#ffff',
        marginTop: '16%',
        paddingStart: '5%',
        paddingEnd: '5%',
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    Settings: {
        position: 'absolute',
        top: 20,
        right: 15,
        zIndex: 2,
    },
    configIcon: {
        zIndex: 2,
    },
    circleImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
        position: 'absolute',
        left: 10,
        top: 5,
        zIndex: 1,
    },
    LinhaHeader:{
        width: '100%',
        height: 1,
        backgroundColor: '#ffff',
        position: 'absolute',
        top: 60,
        elevation:5,
        zIndex: 1,
    },
});
