import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation }from '@react-navigation/native';
 export default function Welcome(){
    const navigation = useNavigation();
    return(
        <View style={styles.container}> 
            <View style={styles.containerLogo}>
                <Animatable.Image
                animation="flipInY"
                source={require('../../assets/backwelcome.png')}
                style={{height:"100%",alignSelf:"center", width:"100%",marginTop:200,}}
                resizeMode = "cover"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
            <Text style={styles.ApresentaApp}> Gerenciamento de Transporte para Universitários. Encontre aqui a melhor empresa para te levar até sua Instituição de Ensino!</Text>
            <Text style={styles.FÇlogin}>Faça o login ou Cadastre-se para começar</Text>
            <TouchableOpacity style={styles.buttonlogin}
            onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.buttontext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttoncadastro}
            onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.buttontext}>Cadastrar-se</Text>
            </TouchableOpacity>
           
            </Animatable.View>
            


        </View>
    );
 };

const styles = StyleSheet.create({
    titulo: {
        position: 'absolute',
        fontSize: 100,
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 2,
        top: '20%',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 2, height: 8 }, 
        textShadowRadius: 7, 
    },
    container: {
        flex: 1,
        backgroundColor : 'rgba(0, 141, 134, 1)',
    },
    containerLogo:{
        flex: 2.5,
        backgroundColor: 'rgba(0, 141, 134, 1)',
        justifyContent: 'center',
        alignItems: ' center',
        marginTop: -100,

    },
    containerForm: {
        flex: 1.2,
        backgroundColor: '#ffff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',

    },
    ApresentaApp:{
        color: '#343434',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
    },
    FÇlogin:{
        color: '#a1a1a1',
        textAlign: 'center',
        right: 3,
        marginTop:10,
    },
    buttonlogin: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 141, 134, 1)',
        borderRadius: 10,
        paddingVertical: 8,
        width: '45%',
        height:'15%',
        left: '8%', 
        bottom: 30, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttoncadastro: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 141, 134, 1)',
        borderRadius: 10,
        paddingVertical: 8,
        width: '45%',
        height:'15%',
        right: '8%', 
        bottom: 30, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',

    },



})