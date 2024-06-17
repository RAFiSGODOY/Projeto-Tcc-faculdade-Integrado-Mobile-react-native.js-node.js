import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import Loading2 from '../../components/Loading2';

export default function Home() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [modalColor, setModalColor] = useState('#FF0000');
    const [userCpf, setUserCpf] = useState('');
    const [userTell, setUserTell] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [idEmpresa, setIdEmpresa] = useState('');
    const [empresaNome, setEmpresaNome] = useState('');
    const [empresaEncontrada, setEmpresaEncontrada] = useState([]);
    const [mensagem, setMensagem] = useState('Usuário sem contrato ativo...');
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [errorTotais, setErrorTotais] = useState('');
    const [empresa, setEmpresa] = useState([]);
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const route = useRoute();
    const showAndHideError = (message) => {
        setErrorTotais(message);
        setShowModal2(true);
        setModalColor('#FF0000');
        setTimeout(() => {
          setShowModal2(false);
          setErrorTotais('');
        },1500);
      };
    
      const showAndHideSuccess = (message) => {
        setErrorTotais(message);
        setShowModal2(true);
        setModalColor('#00A925');
        setTimeout(() => {
          setShowModal2(false);
          setErrorTotais('');
        }, 1500);
      };
    useEffect(() => {
        if (route.name === 'Home' && !animationPlayed) {
            setAnimationPlayed(true);
        }
    }, [route]);

    useEffect(() => {
        let isMounted = true;
        const buscarDadosUsuario = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                console.log("passei aqui");

                if (token && isMounted) {
                    const [userResponse, empresaResponse] = await Promise.all([
                        api.get('/client', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }),
                        api.get('/contrato', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                    ]);
                    setUserName(userResponse.data.nome);
                    setUserCpf(userResponse.data.cpf);
                    setUserEmail(userResponse.data.email);
                    setUserTell(userResponse.data.telefone);
                    const servicos = empresaResponse.data;
                    console.log(servicos);
                    if (empresaResponse.data.length > 0) {
                        setEmpresa(servicos);
                        setIdEmpresa(servicos[0].id_empresa);
                        console.log(servicos[0].id_empresa);
                        setEmpresaNome(servicos[0].nome);
                        setEmpresaEncontrada(servicos);
                        setMensagem('');
                    } else {
                        setEmpresa([]);
                        setMensagem('Nenhum Contrato Encontrado...');
                    }
                } else {
                    setMensagem('Nenhum Contrato Encontrado...');
                }
            } catch (error) {
                console.log("Deu Erro aqui", error);
            } finally {
                if (isMounted) {
                    setCarregando(false);
                }
            }
        };

        buscarDadosUsuario();

        return () => {
            isMounted = false;
        };
    }, []);
    const cancelarContrato = async (idEmpresa) => { 
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (token && idEmpresa) {
            const response = await api.delete(`/client/contrato/${idEmpresa}`, { 
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Contrato cancelado com sucesso:", response.data);
            showAndHideSuccess('Contrato Cancelado!');
            navigation.navigate('Procurar')
            setCarregando(true);
           
          } else {
            setMensagem('Nenhum Contrato Encontrado...');
          }
        } catch (error) {
          console.error("Erro ao cancelar contrato:", error); 
        } 
      };


    function formatarTelefone(numero) {
        const numeroLimpo = String(numero ?? '').replace(/\D/g, '');
        if (numeroLimpo.length === 11) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        } else {
            return numeroLimpo;
        }
    }

    const formatarPreco = (preco) => {
        if (preco == null || preco == undefined) {
          return'0'; 
        }
        const precoNumerico = parseFloat(preco) || 0; 
        let formatted = precoNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return formatted.slice(0, -3);
      };
    

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={showModal2} transparent>
                    <Animatable.View animation="fadeInLeft" duration={300} style={styles.modalContainer2}>
                        <Animatable.View animation="bounceIn" duration={1000} style={[styles.modalContent2, { backgroundColor: modalColor }]}>
                         <Text style={styles.modalMessage2}>{errorTotais}</Text>
                        </Animatable.View>
                    </Animatable.View>
                </Modal>
            <Modal visible={showModal} transparent animationType="fade">
                <SafeAreaView style={styles.modalContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.modalButton2} onPress={() => setShowModal(false)}>
                                <Feather name="x" size={22} color={'#4b4b4b'} style={styles.PinFechar} />
                                </TouchableOpacity>
                            <Text style={styles.modalTitle}>CANCELAR CONTRATO ?</Text>
                            <Text style={styles.modalMessage}>
                                Deseja realmente cancelar seu serviço de transporte contratado com a empresa: {empresaNome}?
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButtonConfirm} onPress={() => cancelarContrato(idEmpresa)}>
                                    <Text style={styles.modalButtonText}>CANCELAR CONTRATO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
            <View style={styles.header2}></View>

            {carregando ? (
                <Loading2 />
            ) : empresa.length > 0 ? (
                <View>
                    <View style={styles.header}>
                        <View style={styles.formHeader}>
                            <TouchableOpacity style={styles.configIcon} onPress={() => navigation.navigate('Configuracoes')}>
                                <Feather name="settings" size={22} color={'#fff'} style={styles.settingsIcon} />
                            </TouchableOpacity>
                            <Text style={styles.welcomeText}>Olá, </Text>
                            <Text style={styles.usernameText}>{userName}</Text>
                        </View>

                    </View>
                    <Text style={styles.TextAlertContratos}>Contratos</Text>
                    <View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            duration={800}
                            style={styles.container1}
                        >
                            <TouchableOpacity style={styles.buttonCancelarContrato} onPress={() => setShowModal(true)}>
                                <Text style={styles.textCancelar}>Cancelar Contrato</Text>
                            </TouchableOpacity>
                            <Text style={styles.textnenhumservico}>Contrato Ativo</Text>
                            <View style={styles.circuloverde}></View>
                            {empresa.map((servico, index) => (
                                <View key={index}>
                                    <View style={styles.SnomeEmpresa}>
                                        <Text style={styles.SservicoEmpresa1}>Empresa Contratada</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresaContainer}>
                                        <Text style={styles.SservicoEmpresa}>{servico.nome}</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresa}>
                                        <Text style={styles.SservicoEmpresa1}>Cidade de saída</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresaContainer}>
                                        <Text style={styles.SservicoEmpresa}>{servico.rota_inicio}</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresa}>
                                        <Text style={styles.SservicoEmpresa1}>Cidade de Destino</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresaContainer}>
                                        <Text style={styles.SservicoEmpresa}>{servico.rota_fim}</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresa}>
                                        <Text style={styles.SservicoEmpresa1}>Valor a ser Pago Mensalmente</Text>
                                    </View>
                                    <View style={styles.SnomeEmpresaContainer}>
                                        <Text style={styles.SservicoEmpresa}>R$: {formatarPreco(servico.Total)},00</Text>
                                    </View>
                                </View>
                            ))}
                        </Animatable.View>
                    </View>
                </View>
            ) : (
                <View>
                    <View style={styles.header}>
                        <View style={styles.formHeader}>
                            <TouchableOpacity style={styles.configIcon}>
                                <Feather name="lock" size={22} color={'#fff'} style={styles.settingsIcon} />
                            </TouchableOpacity>
                            <Text style={styles.welcomeText}>Usuário sem Contrato Ativo</Text>
                            <Text style={styles.usernameText}></Text>
                        </View>
                    </View>
                    <Text style={styles.TextAlertContratos}>Contratos</Text>
                    <View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            duration={800}
                            style={styles.container1}
                        >
                            <Text style={styles.textnenhumservico}>{mensagem}</Text>
                            <View style={styles.circulovermelho}></View>
                        </Animatable.View>
                    </View>
                </View>
            )}
             <View style={styles.Navigator}>
            <TouchableOpacity style={styles.NavigationHome} onPress={() => navigation.navigate('Procurar')}>
            <Feather name="search" size={20} color={'#005C58'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarText}>Procurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavigationProcurar} onPress={() => navigation.navigate('Home')}>
            <Feather name="briefcase" size={20} color={'#ffff'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarT}>Contratos</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    //<View style={styles.infospessoais2}>
  //  <Feather name="phone" size={16} color={'#fff'} style={styles.PinValor} />
   // <Text style={styles.infoptext}>{formatarTelefone(userTell)}</Text>
//</View>
//<View style={styles.infospessoais3}>
 //   <Feather name="lock" size={16} color={'#fff'} style={styles.PinValor} />
  //  <Text style={styles.infoptext2}>{userCpf}</Text>
//</View>

//<View style={styles.infospessoais}>
 //   <Feather name="mail" size={16} color={'#fff'} style={styles.PinValor} />
 //   <Text style={styles.infoptext3}>{userEmail}</Text>
//</View>
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalContainer2: {
        width: "100%",
        opacity: 1,
        top: '86%',
        alignSelf: "center",
        
      },
      modalButton2: {
        backgroundColor: 'transparent',
        position:'absolute',
        marginTop:'-0%',
        marginLeft:'93.5%',
        width:'7%',
        height:'auto',
        paddingBottom:3,
        
    },
      modalContent2:{
          height:'25%',
          width:'95%',
          borderRadius:5,
          marginLeft:10,
          
      },
      modalMessage2: {
          fontSize: 14,
          fontWeight: "500",
          textAlign: "center",
          justifyContent:'center',
          paddingTop:14,
          color: "white",
          
          
      },
    circulovermelho: {
        width:10,
        height:10,
        backgroundColor:'red',
        position:'absolute',
        borderColor:'white',
        borderWidth:0.5,
        right:0,
        borderRadius:10,
        marginRight:10,
        padding:10,
        marginTop:2,
        elevation:10,
        zIndex:2,
    },
    modalContainer: {
        width:'100%',
        backgroundColor:'rgba(0, 0, 0, 0.35)',
        height:'100%',
        padding:10,
    },
    modalContent: {
        backgroundColor: '#ffff',
        width:'100%',
        height:'24%',
        alignSelf:'center',
        borderRadius: 0,
        marginTop:'147%',
        bottom:0,
        borderRadius:10,
        
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign:'center',
        marginTop:0,
        paddingVertical:10,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        color:'#4b4b4b',
        borderColor:'#fff',
        width:'100%',
        alignSelf:'center',
    },
    modalMessage: {
        fontSize: 14,
        marginTop: 5,
        padding:10,
        borderRadius:10,
        textAlign:'justify',
        width:'90%',
        alignSelf:'center',
        color:'#7b7b7b',
        backgroundColor:'#f0f0f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent:'space-around',
        marginTop:'2%',
    },
    modalButtonConfirm: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginTop:'5%',
        width:'85%',
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign:'center',
        fontSize:14,
    },
    buttonCancelarContrato:{
        width:'30%',
        zIndex:3,
        backgroundColor:'red',
        position:'absolute',
        marginTop:'108%',
        borderRadius:5,
        marginLeft:250,
        height:'6%',
        elevation:5,
        padding:6,
    },
    textCancelar:{
     color:'white',
     textAlign:'center',
     fontSize:10,
     
    },
    flexRow:{
        flexDirection:'row',
        width:'100%',
        paddingHorizontal:50,
    },
    paddingBranco:{
        padding:10,
        height:'80%',
        marginTop:'60%',
    },
    SservicoEmpresa:{
        paddingTop:10,
        paddingBottom:10,
        textAlign:'center',
        letterSpacing:5,
        fontSize:20,
        color:'#4b4b4b',
    },
    TextAlertContratos:{
        width:'95%',
        marginTop:30,
        borderBottomWidth:0.5,
        color:'#00413E',
        fontSize:12,
        textTransform:'uppercase',
        textAlign:'left',
        alignSelf:'center',
    },
    SnomeEmpresaContainer:{
        alignSelf:'center',
        width:'95%',
        marginTop:5,
        marginBottom:5,
        borderRadius:5,
        backgroundColor:'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4, 
        padding:5,
    },
    SservicoEmpresa1:{
        width:'93%',
        color:'#00413E',
        fontSize:10,
        marginLeft:0,
        textTransform:'uppercase',
        textAlign:'flex-end',
    },
    SnomeEmpresa:{
     marginTop:10,
     flexDirection:'row',
     borderBottomWidth:0.5,
     width:'95%',
     alignSelf:'center',
     borderColor:'#00413E',
     
    
    },
    circuloverde:{
        width:10,
        height:10,
        backgroundColor:'#31F600',
        position:'absolute',
        borderColor:'white',
        borderWidth:0.5,
        right:0,
        borderRadius:10,
        marginRight:10,
        marginTop:2,
        elevation:10,
        zIndex:2,
        
    },
    paginaindisponivel:{
      fontSize:28,
      width:'100%',
      color:'#343434',
      textAlign:'center',
      marginBottom:10,
    },
    contrateUmaEmpresa:{
        fontSize:14,
        width:'100%',
        color:'#343434',
        textAlign:'center',
        padding:20,
    },
    button: {
        backgroundColor: 'rgba(0, 141, 134, 1)',
        borderRadius: 10,
        flexDirection:'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width:'80%',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
      },
    buttontext: {
        fontSize: 18,
        marginRight:20,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer:{
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        backgroundColor:'#F0F0F0',
        height:'50%',
        borderRadius:10,
        
        
    },
    textnenhumservico:{
        color:'#fff',
        borderColor:'#c3c3c3',
        fontSize:14,
        textAlign:'center',
        marginTop:'-2%',
        paddingTop:5,
        paddingBottom:5,
        alignSelf:'center',
        borderBottomWidth:0.5,
        backgroundColor:'#00CC76',
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        width:'100%',
        justifyContent:'center',
        elevation:5,
        zIndex:2,
    },
    header:{
        backgroundColor:'rgba(0, 141, 134, 1)',
        paddingBottom:10,
        height:80,
        borderRadius:20,
        
    },
    header2:{
        backgroundColor:'rgba(0, 141, 134, 1)',
        paddingBottom:10,
        width:'100%',
        height:35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        position:'absolute',
    },
    Navigator:{
        flexDirection:'row',
        position:'absolute',
        marginTop:'199.2%',
        width:'100%',
        justifyContent:'space-around',
        backgroundColor:'transparent',
        padding:5,
    },
    NavigationProcurar:{
        backgroundColor:'rgba(0, 141, 134, 1)',
        width:'52.6%',
        borderRadius:0,
        padding:2,
    },
    NavigationHome:{
        backgroundColor:'#f0f0f0',
        width:'52.6%',
        borderRadius:0,
        padding:2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    PinProcurar:{
      alignSelf:'center',
    },
    NavigationProcurarText:{
      textAlign:'center',
      color:'#00413E',
      fontSize:10,
    },
    NavigationProcurarT:{
        textAlign:'center',
        color:'#ffff',
        fontSize:10,
      },
    configIcon:{
        position:'absolute',
        width:'94%',
    },
    settingsIcon:{
      alignSelf:'flex-end',
    },
    
    PinValor:{
        marginRight:5,
        marginLeft:5,
    },
    infoptext:{
       color:'#3b3b3b',
       width:'150%',
       fontSize:12,
    },
    infoptext2:{
        color:'#3b3b3b',
        width:'100%',
        fontSize:12,
     },
     infoptext3:{
        color:'#3b3b3b',
        width:'100%',
        fontSize:12,
     },
    infospessoais:{
        flexDirection:'row',
        marginTop:5,
        width:'100%',
        marginLeft:5,
    },
    infospessoais2:{
        flexDirection:'row',
        marginLeft:5,
        marginTop:5,
        width:'40%',
    },
    infospessoais3:{
        flexDirection:'row',
        marginLeft:5,
        marginTop:5,
    },
    innerShadowContainer: { 
        flex: 1, 
        borderRadius: 5, 
        overflow: 'hidden', 
        backgroundColor: 'white', 
      },
    
      innerShadow: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: 'black', 
        shadowOffset: { width: 0, height: 0 }, 
        shadowOpacity: 0.2,
        shadowRadius: 5, 
      },
    container1:{
        marginTop:20,
        backgroundColor:'#fff',
        padding:0,
        alignSelf:'center',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        width:'95%',
        height:'74.5%',
        elevation:2,
    },
    formHeader: {
        flexDirection:'row',
        marginTop:40,
        width:'100%',
        marginLeft:10,
        textAlign:'center',
    },
    empresacontratada:{
        
    },
    InfoEmpresaBack:{
        
    },
    InfoEmpresa:{
        color:'rgba(0, 0, 0, 0.95)',
        fontSize:14,
        fontWeight:'500',
        marginTop:'5%',
        textAlign:'center',
    },

    InfosE:{
        color:'black',
        paddingBottom:10,
        paddingTop:10,
        fontSize:28,
        fontWeight:'600',
        textAlign:'center',
        letterSpacing:5,
        textTransform:'uppercase',
    },

    Nomeempresa:{
        color:'black',
        paddingBottom:10,
        paddingTop:10,
        fontSize:28,
        fontWeight:'600',
        textAlign:'center',
        letterSpacing:5,
        textTransform:'uppercase',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '600',
        color:'#fff',
    },
    usernameText: {
        fontSize: 18,
        fontWeight: '600',
        color:'#fff',
        
        
    },
   
    
});
