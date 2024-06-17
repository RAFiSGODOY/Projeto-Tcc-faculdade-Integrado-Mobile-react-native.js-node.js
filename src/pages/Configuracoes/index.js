import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, TextInput,Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, SafeAreaView} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function Configurações() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userCpf, setUserCpf] = useState('');
    const [userTell, setUserTell] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDataNascimento, setUserDataNascimento] = useState('');
    const [userCidade, setUserCidade] = useState('');
    const [cep, setCep] = useState('');
    const [userEstado, setUserEstado] = useState('');
    const [userBairro, setUserBairro] = useState('');
    const [userLogradouro, setUserLogradouro] = useState('');
    const [userCasa, setUserCasa] = useState('Não informado');
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
      const getAdressFromApi = useCallback(() => {
        const sanitizedCep = cep.replace('-', '');
        fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`)
            .then(res => res.text()) 
            .then((data) => {
                
                if (data.startsWith('<')) {
                    throw new Error('API returned HTML instead of JSON');
                }
                const jsonData = JSON.parse(data);
                setUserEstado(jsonData.uf);
            })
            .catch(err => {
                console.log('Erro ao buscar endereço:', err);
            });
    }, [cep]);
    function formatarTelefone(numero) {
        const numeroLimpo = String(numero ?? '').replace(/\D/g, ''); // Converte para string e remove não numéricos
      
        if (numeroLimpo.length === 11) {
          return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        } else {
          return numeroLimpo; 
        }
      }
    const formatarDataNascimento = (data) => {
        if (!data) return '';
        if (data.includes('T')) {
            const partesData = data.split('T');
            const dataNascimento = partesData[0];
            const [ano, mes, dia] = dataNascimento.split('-');
            return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
        } else {
            return data;
        }
    };

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const userResponse = await api.get('/client', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = userResponse.data;

                setUserName(userData.nome);
                setUserCpf(userData.cpf);
                setUserEmail(userData.email);
                setUserTell(userData.telefone);
                setUserDataNascimento(formatarDataNascimento(userData.data_nascimento));
                setCep(userData.cep);
                setUserCidade(userData.municipio);
                setUserBairro(userData.bairro);
                setUserLogradouro(userData.logradouro);
                setUserCasa(userData.n_casa);
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
            if (error.response && error.response.status === 500) {
                console.log('Erro interno no servidor.');
                showAndHideError("Erro ao buscar os dados do usuário!");
            } else {
                console.log('Erro ao buscar os dados do usuário.');
                showAndHideError("Erro ao buscar os dados do usuário.");
            }
        }
    };
    useEffect(() => {
        getAdressFromApi();
    }, [cep]);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );
    
    return (
        <SafeAreaView style={styles.container}> 
        <StatusBar backgroundColor="#ffff" barStyle="light-content"/>
                <Modal visible={showModal} transparent>
                    <Animatable.View animation="fadeInLeft" duration={300} style={styles.modalContainer}>
                        <Animatable.View animation="bounceIn" duration={1000} style={[styles.modalContent, { backgroundColor: modalColor }]}>
                         <Text style={styles.modalMessage}>{errorTotais}</Text>
                        </Animatable.View>
                    </Animatable.View>
                </Modal>
            <StatusBar translucent backgroundColor="transparent" />
           
                <TouchableOpacity
                 activeOpacity={0.8}
                 style={styles.bottom2}
                 onPress={() => navigation.navigate('Nome')}
                 >
                <Animatable.View animation="fadeInLeft" duration={100} style={styles.formContainer}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Nome</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="user" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userName}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('Telefone')}>
                <Animatable.View animation="fadeInRight" duration={400} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Telefone</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="phone" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{formatarTelefone(userTell)}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity >
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom}>
                <Animatable.View animation="fadeInLeft" duration={800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="lock" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>CPF</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="lock" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userCpf}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity >
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('Email')}>
                <Animatable.View animation="fadeInRight" duration={1200} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>E-mail</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="mail" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userEmail}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('DataNascimento')}>
                <Animatable.View animation="fadeInLeft" duration={1600} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Data de Nascimento</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="calendar" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userDataNascimento}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom}>
                <Animatable.View animation="fadeInRight" duration={2000} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="lock" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Estado</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userEstado}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('Cidade')}> 
                <Animatable.View animation="fadeInLeft" duration={2400} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Cidade</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userCidade}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom}onPress={() => navigation.navigate('Bairro')}>
                <Animatable.View animation="fadeInRight" duration={2800} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Bairro</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userBairro}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('Logradouro')}>
                <Animatable.View animation="fadeInLeft" duration={3200} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>Logradouro</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userLogradouro}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.bottom} onPress={() => navigation.navigate('NCasa')}>
                <Animatable.View animation="fadeInRight" duration={3600} style={styles.formContainer2}>
                    <View style={styles.EstiloContainerPinNome}>
                        <Feather name="edit" size={16} color={'#005C58'} style={styles.PinEdit} />
                        <Text style={styles.NomeEdit}>N°  Casa</Text>     
                    </View>
                    <View style={styles.ContainerMostrarNomePin}>
                       <Feather name="map-pin" size={22} color={'#005C58'} style={styles.PinIcon} />
                       <Text style={styles.Campo}>{userCasa}</Text>  
                    </View>
                </Animatable.View>
                </TouchableOpacity>
               
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    bottom:{
        height:'10%',
        backgroundColor:'white',
        paddingTop:10,
        borderBottomWidth:0.5,
        borderColor:'#b4b5b6',
    },
    bottom2:{
        height:'10%',
        backgroundColor:'white',
        paddingTop:10,
        borderBottomWidth:0.5,
        borderColor:'#b4b5b6',
    },
    ContainerMostrarNomePin:{
      flexDirection:'row',
    },
    EstiloContainerPinNome:{
      flexDirection:'row-reverse',
      marginBottom:10,
      marginTop:-5,
    },
    Campo:{
        fontSize:16,
        width:'100%',
        marginLeft:5,
        color:'#9e9e9e',
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
    line1: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#005C58',
        marginRight: 5,
    },
    formContainer: {
        padding:5,
        width:'95%',
        borderRadius:5,
        alignSelf:'center',
    },
    formContainer2: {
        padding:5,
        width:'95%',
        borderRadius:5,
        alignSelf:'center',
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
