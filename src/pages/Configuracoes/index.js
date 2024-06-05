import React, { useState, useEffect} from 'react';
import { View, Text, TextInput,Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import Onibus from '../../assets/semfundo.png';


export default function Configurações() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userCpf, setUserCpf] = useState('');
    const [userTell, setUserTell] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [modalColor, setModalColor] = useState('#FF0000'); 
    const [showModal, setShowModal] = useState(false);
    const [errorTotais, setErrorTotais] = useState('');


    const showAndHideError = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#FF0000');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        },1500);
      };
    
      const showAndHideSuccess = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#00A925');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        }, 1500);
      };

      const Loading = () => {

      }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const userResponse = await api.get('/client', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUserName(userResponse.data.nome);
                    setUserCpf(userResponse.data.cpf);
                    setUserEmail(userResponse.data.email);
                    setUserTell(userResponse.data.telefone);

                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                if (error.response && error.response.status === 500) {
                    console.log('Erro interno no servidor.');
                    console.log('Ocorreu um erro ao buscar os dados do usuário!');
                    showAndHideError("Erro ao buscar os dados do usuário!");
                } else {
                    console.log('Erro ao buscar os dados do usuário.');
                    showAndHideError("Erro ao buscar os dados do usuário.");
                    console.log(error);
                }
            }
        };
    
        fetchUserData();
    }, []);
    
    return (
        <SafeAreaView style={styles.container}> 
        <Image source={Onibus} style={styles.backgroundImage} resizeMode='cover' />
                <Modal visible={showModal} transparent>
                    <Animatable.View animation="fadeInLeft" duration={300} style={styles.modalContainer}>
                        <Animatable.View animation="bounceIn" duration={1000} style={[styles.modalContent, { backgroundColor: modalColor }]}>
                         <Text style={styles.modalMessage}>{errorTotais}</Text>
                        </Animatable.View>
                    </Animatable.View>
                </Modal>
            <StatusBar translucent backgroundColor="transparent" />
           
            <View style={styles.innerContainer}>
                <View style={styles.infoHeader}>
                        <Text style={styles.TextHeader}>Configurações</Text> 
                    </View>
                    
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Nome</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="user" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>Rafael Godoy Pinguelo</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Telefone</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="phone" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>(44) 9 9896-9205</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="lock" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>CPF</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="lock" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>062.267.279-77</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>E-mail</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="mail" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>rafaelgpinguelo@gmail.com</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Data de Nascimento</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="calendar" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>27/03/2004</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Estado</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>Paraná</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Cidade</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>Peabiru</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Bairro</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>Bela Vista</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Logradouro</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>Otácilio Ferreira Lima</Text>  
                    </View>
                </Animatable.View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>N°  Casa</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>228</Text>  
                    </View>
                </Animatable.View>
               
            </View>
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 141, 134, 0.050)',
        
    },
    ContainerMostrarNomePin:{
      flexDirection:'row',
    },
    EstiloContainerPinNome:{
      flexDirection:'row-reverse',
    },
    Campo:{
        fontSize:16,
        width:'100%',
        marginLeft:5,
        color:'#00413E',
    },
    NomeEdit:{
     width:'95%',
     fontSize:10,
     color:'#6c6c6c'
    },
    modalContainer: {
        width: "100%",
        opacity: 1,
        top: '86%',
        alignSelf: "center",
      },
      modalContent:{
          height:'25%',
          width:'95%',
          borderRadius:5,
          marginLeft:10,
      },
      modalMessage: {
          fontSize: 14,
          fontWeight: "500",
          textAlign: "center",
          justifyContent:'center',
          paddingTop:14,
          color: "white",
          
          
      },
    infoHeader:{
        marginTop:60,
    },
    line1: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#005C58',
        marginRight: 5,
    },
    backgroundImage: {
        height: "78%", 
        width: "100%",  
        position: 'absolute',
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    formContainer: {
        padding:5,
        width:'95%',
        height:'7%',
        backgroundColor:'#fff',
        borderRadius:5,
        alignSelf:'center',
        marginTop:'8%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    formContainer2: {
        padding:5,
        width:'95%',
        height:'7%',
        backgroundColor:'#fff',
        borderRadius:5,
        alignSelf:'center',
        marginTop:'4.7%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
 
    TextHeader: {
        fontSize: 24,
        fontWeight: '900',
        color: "#fff",
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.45)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
    },
 
    
});
