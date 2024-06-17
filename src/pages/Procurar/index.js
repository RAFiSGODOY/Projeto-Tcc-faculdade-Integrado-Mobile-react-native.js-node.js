import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, TextInput,Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import Onibus from '../../assets/semfundo.png';
import moment from 'moment-timezone';
import Loading from '../../components/Loading';
import { useFocusEffect } from '@react-navigation/native';

export default function Procurar() {
    const navigation = useNavigation();
    const [rotaInicio, setRotaInicio] = useState('');
    const [rotaFim, setRotaFim] = useState('');
    const [idEmpresa, setIdEmpresa] = useState('');
    const [servicosEncontrados, setServicosEncontrados] = useState([]);
    const [mensagem, setMensagem] = useState('Nenhum serviço encontrado');
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [height, setHeight] = useState('');
    const [etapa, setEtapa] = useState(1);
    const [modalColor, setModalColor] = useState('#FF0000'); 
    const [showModal, setShowModal] = useState(false);
    const [errorTotais, setErrorTotais] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [temContratosAtivos, setTemContratosAtivos] = useState(false);
    const [valorTotalPreco, setValorTotal] = useState('');
    const showAndHideError = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#FF0000');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        },1500);
      };
      useFocusEffect(
        useCallback(() => {
          setServicosEncontrados([]); 
          setMensagem('Nenhum serviço encontrado'); 
          setRotaInicio('');
          verificarEtapa();
          
           
        }, []) 
      );

      const verificarEtapa = () =>{
        if(temContratosAtivos == false){
            setEtapa(1);
        }
        return
      }
      const showAndHideSuccess = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#00A925');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        }, 1500);
      };
      const verificarContrato = useCallback(async () => {
       
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
              const contratosResponse = await api.get('/contrato', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (contratosResponse.data.length > 0) {
                navigation.navigate('Home'); 
              } else {
                showAndHideError('Contrate um serviço para ter acesso.'); 
                verificarEtapa();
              }
            }
          } catch (error) {
            console.error("Erro ao verificar contratos:", error);
            showAndHideError('Erro ao verificar contratos.');
          }
      }, []);
      useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const token = await AsyncStorage.getItem('userToken');
                    if (token) {
                        const contratosResponse = await api.get('/contrato', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (contratosResponse.data.length > 0) {
                            console.log("REsult")
                            setContratos(contratosResponse.data);
                            setTemContratosAtivos(true);
                        } else {
                            setContratos([]);
                            console.log("REsult2")
                            setTemContratosAtivos(false);
                            console.log("ativo?")
                            console.log(temContratosAtivos)
                        }
                    }
                } catch (error) {
                    console.log('Error fetching user data:', error);
                    if (error.response && error.response.status === 500) {
                        console.log('Erro interno no servidor. Por favor, tente novamente mais tarde.');
                        console.log('Ocorreu um erro ao buscar os dados do usuário. Por favor, tente novamente mais tarde.');
                        showAndHideError("Erro ao buscar os dados do usuário, tente novamente em alguns minutos!");
                    } else {
                        console.log('Erro ao buscar os dados do usuário.');
                        showAndHideError("Erro ao buscar os dados do usuário.");
                        console.log(error);
                    }
                }
            };

            setServicosEncontrados([]);
            setMensagem('Nenhum serviço encontrado');
            setRotaInicio('');
            fetchUserData();
            verificarEtapa();
        }, [])
    );
    const acceptService = async () => {
        try {
            const dataAtual = new Date(); 
            await sendContractData(
                selectedServico.id_servico,
                selectedServico.id_empresa,
                dataAtual, 
                dataAtual, 
                dataAtual,
                valorTotalPreco, 
            );
           
        } catch (error) {
            console.log('Erro ao aceitar serviço e criar contrato:', error);
            showAndHideError("Erro ao aceitar serviço e criar contrato!");
            
        }
    };
    const sendContractData = async (idServico, idEmpresa, dataInicio, dataFimContrato, dataContrato, valorTotalPreco) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const dt_inicio = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
                const dt_fim = moment().tz('America/Sao_Paulo').add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
                const dt_contrato = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    
                
                console.log('Dados do contrato a serem enviados:', {
                    id_servico: idServico,
                    id_empresa: idEmpresa,
                    vl_total: valorTotalPreco,
                    vl_desconto: 0, 
                    dt_inicio: dt_inicio,
                    dt_fim: dt_fim, 
                    dt_contrato: dt_contrato,
                });

                const response = await api.post('/contrato', {
                    id_servico: idServico,
                    id_empresa: idEmpresa,
                    vl_total: valorTotalPreco,
                    vl_desconto: 0,
                    dt_inicio: dt_inicio,
                    dt_fim: dt_fim, 
                    dt_contrato: dt_contrato,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Contrato criado com sucesso:', response.data);
                console.log('Serviço aceito:', selectedServico);
                console.log(selectedServico, response.data)
                setTemContratosAtivos(true);
                showAndHideSuccess("Contrato aceito com sucesso!");
                setEtapa(2);
            }
        } catch (error) {
            console.error('Erro ao criar contrato:', {
                tipo: error.name,
                status: error.response?.status, 
                dadosDaResposta: error.response?.data
              });
            
            showAndHideError("Erro ao criar contrato, Tente novamente mais tarde!");
        }
    };
    
    
    
    
    
    
    const formatarPreco = (preco) => {
        let formatted = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return formatted.slice(0, -3);
    };
    
   
    
    const buscarServicosOferta = async () => {
        setIsLoading(true);
        if(!rotaInicio || !rotaFim ){
        try {
            const response = await api.get('/servico-oferta', {
                params: {
                    rota_inicio: rotaInicio,
                    rota_fim: rotaFim,
                },
            });
            const servicos = response.data;
            if (servicos.length > 0) {
                setServicosEncontrados(servicos);
                setMensagem('Serviços Encontrados:');
                setIsLoading(false);
            } else {
                setServicosEncontrados([]);
                setMensagem('Nenhum Serviço Encontrado');
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Erro ao buscar serviços de oferta:', error);
            setIsLoading(false);
            showAndHideError("Erro ao buscar serviços!");
            setServicosEncontrados([]);
        } 
    }else{
        showAndHideError('Digite a Cidade de Partida ou de Destino!');
        setIsLoading(false);
    }
    };
    const openModal = (servico) => {
        if (temContratosAtivos) {
            showAndHideError("Você já possui um Contrato Ativo!");
            return; 
        }else {
           setSelectedServico(servico);
        setValorTotal(servico.preco);
        setIsModalVisible(true); 
        }
        
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedServico(null);
    };

            

    return (
        <SafeAreaView style={styles.container}> 
        <View style={styles.headerVerde}></View>
                <Modal visible={showModal} transparent>
                    <Animatable.View animation="fadeInLeft" duration={300} style={styles.modalContainer}>
                        <Animatable.View animation="bounceIn" duration={1000} style={[styles.modalContent, { backgroundColor: modalColor }]}>
                         <Text style={styles.modalMessage}>{errorTotais}</Text>
                        </Animatable.View>
                    </Animatable.View>
                </Modal>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.innerContainer}>
                
                <Animatable.View animation="fadeInDown" duration={800}>
                        <SearchBar
                            placeholder="Procure Contratos em sua Cidade"
                            value={rotaInicio}
                            containerStyle={styles.searchBarContainer}
                            inputContainerStyle={styles.searchBarInputContainer}
                            inputStyle={styles.searchBarInput}
                            searchIcon={{ size: 26, color: '#7C7C7C' }}
                            clearIcon={{ size: 22, color: '#7C7C7C' }} 
                            lightTheme 
                            round 
                            showLoading={isLoading} 
                            onChangeText={(text) => {
                                setRotaInicio(text);
                                if (timeoutId) { 
                                  clearTimeout(timeoutId); 
                                }
                                setTimeoutId(setTimeout(() => buscarServicosOferta(), 1500)); 
                              }}
                            />
                </Animatable.View >
                <Animatable.View animation="fadeInUp" duration={800} style={styles.resultsContainer}>
                    
                    {servicosEncontrados.length > 0 ? (
                        
                        <ScrollView style={styles.servicosContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.resultadoContainer}>
                                <Text style={styles.resultadoText}>Resultados da sua Busca</Text>
                            </View>
                            {servicosEncontrados.map((servico, index) => (
                                <TouchableOpacity activeOpacity={0.9}
                                key={index} 
                                style={styles.servicoItem} 
                                onPress={() => openModal(servico)}
                            >
                                        <View style={styles.empresapin}>
                                         <Feather name="briefcase" size={18} color={'#6c6c6c'} style={styles.PinEmpresa} />
                                         <Text style={styles.servicoEmpresa}>{servico.nomeEmpresa}</Text> 
                                       
                                        </View>
                                        <View style={styles.Rotas}>
                                            <View style={styles.rtI}>
                                                <Feather name="map-pin" size={20} color={'#005C58'} style={styles.Pin2} />
                                                <Text style={styles.servicoRotaInicio}>{servico.rota_inicio}</Text>
                                            </View>
                                            <Text style={styles.Pin3}>X</Text>
                                            <View style={styles.rtF}>
                                                <Text style={styles.servicoRotaFim}>{servico.rota_fim}</Text>
                                                <Feather name="map-pin" size={20} color={'#005C58'} style={styles.Pin4} />
                                            </View>
                                        </View> 
                                        <View style={styles.precoContainer}>
                                        <Text style={styles.precoSimbolo}>R$:</Text>
                                        <Text style={styles.servicoPreco}>{formatarPreco(servico.preco)},00</Text>
                                    </View>
                                    
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.textnenhumservico}>Nenhum serviço encontrado</Text>
                    )}
                </Animatable.View>
            </View>
            <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={closeModal}
                animationType="fade"
            >
                <View style={styles.modalContainer2}>
                    
                    <View style={styles.modalContent2}>
                        {selectedServico && etapa == 1 && (
                           
                            <Animatable.View >
                                 <View style={styles.infoHeaderModal}>
                                
                                <Text style={styles.infoHeaderTextH}>INFORMAÇÕES DO CONTRATO</Text>
                               
                                </View>
                                <TouchableOpacity activeOpacity={0.8} style={styles.modalButton2} onPress={closeModal}>
                                <Feather name="x" size={22} color={'#4b4b4b'} style={styles.PinFechar} />
                                </TouchableOpacity>
                                <View style={styles.containerCaixa01}>
                                <Feather name="info" size={16} color={'#4b4b4b'} style={styles.PinInfo} />
                                <Text style={styles.modalText2}>As informações do Contrato selecionado serão listadas a baixo, clique em "QUERO CONTRATAR" somente se tiver CERTEZA de sua decisão!</Text>
                                </View>
    
                                
                                <View style={styles.infoHeaderModal}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText}>ROTA ESCOLHIDA</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.RotasEscolhida}>
                                            <View style={styles.rtI}>
                                                <Feather name="map-pin" size={20} color={'#005C58'} style={styles.Pin2} />
                                                <Text style={styles.servicoRotaInicio}>{selectedServico.rota_inicio}</Text>
                                              
                                            </View>  
                                            
                                            <Text style={styles.Pin5}>X</Text>
                                            <View style={styles.rtF}>
                                                <Text style={styles.servicoRotaFim}>{selectedServico.rota_fim}</Text>
                                                <Feather name="map-pin" size={20} color={'#005C58'} style={styles.Pin4} />
                                            </View>
                                </View> 
                                <View style={styles.alinharCity1}>
                                <Feather name="info" size={14} color={'#4b4b4b'} style={styles.PinInfoCity1} />
                                <Text style={styles.textCity1}>(Cidade de saída)</Text>
                                </View>
                                <View style={styles.alinharCity2}>
                                <Feather name="info" size={14} color={'#4b4b4b'} style={styles.PinInfoCity2} />
                                <Text style={styles.textCity2}>(Cidade de Destino)</Text>
                                </View>
                                <View style={styles.infoHeaderModal2}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText2}>INFORMAÇÕES DO PAGAMENTO</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="dollar-sign" size={18} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Valor R$:</Text>
                                <Text style={styles.modalTextinfs2}>{formatarPreco(selectedServico.preco)}</Text>
                                <Text style={styles.modalTextinfs3}>reais.</Text>
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="calendar" size={18} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Tipo de Pagamento:</Text>
                                <Text style={styles.modalTextinfs2}>Mensal</Text>
                                <Text style={styles.modalTextinfs3}>.</Text>
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="pie-chart" size={18} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Duração do Contrato</Text>
                                <Text style={styles.modalTextinfs2}>1</Text>
                                <Text style={styles.modalTextinfs3}>ano.</Text>
                                </View>
                                <View style={styles.infoHeaderModal2}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText2}>INFORMAÇÕES DE COBRANÇA</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.cobrançaContainer}> 
                                <Feather name="info" size={16} color={'#4b4b4b'} style={styles.PinInfo} />
                                    <Text style={styles.modalText3}>A UniBus não efetua nenhum tipo de cobrança, deixamos a responsabilidade desta tarefa para empresa escolhida pelo cliente. 
                                    </Text>  
                                </View>
                                <View style={styles.modalButtons}>

                                    <TouchableOpacity activeOpacity={0.8} style={styles.modalButton} onPress={acceptService}>
                                        <Text style={styles.modalButtonText}>QUERO CONTRATAR</Text>
                                    </TouchableOpacity>
                                   
                                    
                                </View>
                             
                            </Animatable.View>
                        
                        )}{selectedServico && etapa == 2 && (
                           
                            <Animatable.View animation="fadeInUp" delay={200}>
                             
                                <Text style={styles.infoHeaderTextH2}>Empresa Contratada!</Text>
                                <View style={styles.containerCaixa01}>
                                <Feather name="info" size={16} color={'#7b7b7b'} style={styles.PinCheck} />
                                <Text style={styles.modalText4}>Agora você possui um contrato de transporte para sua Instituição de Ensino! Fique tranquilo a baixo vamos te informar como prosseguir daqui em diante, sucesso!</Text>
                                </View>
                                
                                <View style={styles.infoHeaderModal}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText}>E   AGORA?</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.alinharflex}>
                                <Feather name="smartphone" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text  style={styles.text1}>As informações da sua Empresa foram adicionadas ao seu aplicativo!</Text>
                                </View>
                                <View style={styles.alinharflex}>
                                <Feather name="check-circle" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text  style={styles.text1}>Fique tranquilo, já notificamos a empresa "{selectedServico.nomeEmpresa}" sobre sua contratação do serviço de Transporte.</Text>
                                </View>
                                <View style={styles.alinharflex}>
                                <Feather name="user-check" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.text1}>A Empresa "{selectedServico.nomeEmpresa}" entrará em contato para acertar os detalhes sobre o seu transporte.</Text>
                               </View>
                                <View style={styles.infoHeaderModal2}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText2}>IMPORTANTE</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.alinharflex}>
                                <Feather name="map" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.text1}>Seja cauteloso, evite marcar o ponto de embarque muito distante de sua casa. Priorize sempre a sua segurança..</Text>
                                </View>
                                <View style={styles.modalButtons}>

                                    <TouchableOpacity activeOpacity={0.8} style={styles.modalButton} onPress={closeModal}>
                                        <Text style={styles.modalButtonText}>CONFIRMAR E SAIR</Text>
                                    </TouchableOpacity>
                                </View>
                             
                            </Animatable.View>
                        
                        )}
                    </View>
                </View>
           
            </Modal> 
            <View style={styles.Navigator}>
            <TouchableOpacity style={styles.NavigationProcurar} onPress={() => navigation.navigate('Procurar')}>
            <Feather name="search" size={20} color={'#ffff'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarT}>Procurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.NavigationHome} onPress={(verificarContrato)}>
            <Feather name="briefcase" size={20} color={'#005C58'} style={styles.PinProcurar} />
              <Text style={styles.NavigationProcurarText}>Contratos</Text>
            </TouchableOpacity>
            </View>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
    },
    resultadoContainer:{
     borderBottomWidth:0.5,
     paddingBottom:5,
     marginBottom:20,
     borderColor:'#c3c3c3',
    },
    headerVerde:{
        backgroundColor: 'rgba(0, 141, 134, 1)',
        position:'absolute',
        zIndex:5,
        width:'100%',
        height:35,
    },
    textnenhumservico:{
        color:'#7C7C7C',
        fontSize:14,
        textAlign:'center',
        marginTop:'20%',
    },
    resultadoText:{
        color:'#7C7C7C',
        fontSize:14,
        textAlign:'center',
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
    searchBarContainer: {
        backgroundColor: '#fff',
        borderColor:'#fff', 
        marginTop: '10%',
        width: '100%',
        height: "auto",
        alignSelf: 'center',
      },
      searchBarInputContainer: {
        backgroundColor: '#FFF', 
        width:'100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 10.25,
        shadowRadius: 3.84,
        elevation: 4,
      },
      searchBarInput: {
        fontSize: 16,
        color: '#7C7C7C',
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
    noServiceImage: {
        flex: 1,
        width: '50%',
        height: '50%',
    },
    infoHeaderModal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        
    },
    alinharflex:{
        flexDirection:'row',
        alignItems:'center',
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
    image:{
    position:'absolute', 
    width:'100%',
    height:'100%',
    },
    text1:{
        color:'#00413E',
        textAlign:'justify',
        fontSize:13,
        width:'90%',
        fontWeight:'400',
        paddingHorizontal:5,
        marginLeft:5,
        justifyContent:'center',
        marginBottom:6,
        
    },
    infoHeaderModal2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
        
        
        
    },
    infoHeaderText: {
        fontSize: 16,
        color: '#4b4b4b',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
        
    },
    infoHeaderText2: {
        fontSize: 16,
        color: '#4b4b4b',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
       
    },
    infoHeaderTextH: {
        fontSize: 20,
        color: '#4b4b4b',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
       
    },
    infoHeaderTextH2: {
        fontSize: 20,
        alignSelf:'center',
        color: '#4b4b4b',
        marginBottom:20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
       
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
    line2: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#005C58',
        marginLeft: 5,
    },
    lineH: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#005C58',
        marginRight: 5,
        zIndex:2,
    },
    lineH2: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#005C58',
        marginLeft: 5,
    },
    backgroundImage: {
        height: "75%", 
        width: "100%",  
        position: 'absolute',
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    procurartext:{
        position:'absolute',
        color:'#00413E',
        fontWeight:'700',
        fontSize:22,
        zIndex:3,
        textAlign:'center',
        width:'100%',
        marginTop:'12%',
    },
    formContainer: {
        flex: 1,
        flexDirection:'row-reverse',
        justifyContent: 'center',
        paddingTop:50,
        paddingHorizontal:10,
        borderBottomWidth:0.5,
        borderColor:'#00413E',
        position:'absolute',
        width:'100%',
        backgroundColor:'transparent',
        borderRadius:0,
        alignSelf:'center',
        marginTop:'0%',
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 12,
        width:'100%',
        marginTop:'5%',
        marginBottom:46,
    },
    InputContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: '0%',
        width:'90%',
        height: 50,
        alignSelf: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        
    },
    InputContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        marginTop: 20,
        height: 50,
        alignSelf: 'center',
        paddingHorizontal: 10,
        
    },
    Pin: {
        marginRight: 10,
    },
    Pin2: {
        alignSelf: 'center',
    },
    Pin4: {
        alignSelf: 'center',
        marginLeft: 2,
    },
    Pin5: {
        alignSelf: 'center',
        marginLeft: 2,
    },
    Pin3: {
        alignSelf: 'center',
    },
    PinEmpresa:{
       marginRight:5,
       borderRadius:4,
       padding:2,
    },
    empresapin:{
        flexDirection:'row',
    },
    PinValor:{
        marginLeft:5,
    },
    infoDica: {
        color: '#343434',
        fontSize: 10,
        width: '100%',
        borderRadius: 7,
        padding: 5,
        marginTop: '0%',
        alignSelf: 'left',
        //backgroundColor: 'rgba(0, 141, 134, 0.17)',
        textAlign: 'left',
    },
    infoDica2: {
        color: '#343434',
        fontSize: 10,
        width: '100%',
        borderRadius: 7,
        padding: 5,
        marginTop: '0%',
        alignSelf: 'left',
       // backgroundColor: 'rgba(0, 141, 134, 0.17)',
        textAlign: 'left',
    },
    button: {
        flexDirection:'row',
        backgroundColor: 'transparent',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width:40,
        alignSelf:'center',
        marginTop: 0,
      },
      buttonLoading: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 20,
      },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    inputEndereco: {
        flex: 1,
        fontSize: 14,
        width:'50%',
        color: '#7C7C7C',
        textAlign: 'left',
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
    TextHeader2: {
        fontSize: 16,
        fontWeight: '400',
        color: "#fff",
        textAlign: 'center',
        paddingVertical: 6,
        backgroundColor: '#005C58',
        borderRadius: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.45)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
    },
    servicosContainer: {
        flex: 1,
    },
    servicoItem: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
    
    servicoEmpresa: {
        color: '#008B85',
        textAlign: 'center',
        width:'85%',
        textTransform:'uppercase',
        letterSpacing:3,
        alignSelf:'center',
        fontSize: 22,
        fontWeight: '900',
        paddingBottom: 0,
        marginTop:0,
    },
    precoContainer:{
     flexDirection:'row',
     paddingTop: 5,
     paddingBottom: 5,
     marginTop: 10,
     backgroundColor:'#F0F0F0',
     borderRadius:4,
     borderColor:'#6c6c6c',
    },
    servicoPreco: {
        color: '#4B4B4B',
        letterSpacing:0.5,
        width:'15%',
    },
    precoSimbolo:{
        width:'7%',
        marginLeft:'40%',
        color:'#4B4B4B',
        letterSpacing:0.5,
       
    },
    precoSimbolo2: {
      color:'#343434',
      marginLeft:-2,
    },
    precoSimbolo3:{
        color:'#343434',
    },
    Rotas: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around',
    },
    RotasEscolhida: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal:10,
        justifyContent: 'space-between',
    },
    rtI: {
        flexDirection: 'row',
        backgroundColor: '#FFFF',
        borderRadius: 5,
        padding: 5,
        width:'45%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    rtF: {
        flexDirection: 'row',
        backgroundColor: '#FFFF',
        borderRadius: 5,
        width:'45%',
        padding: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    servicoRotaInicio: {
        color: '#4B4B4B',
        fontSize: 14,
        width:'85%',
        textAlign: 'center',
    },
    servicoRotaFim: {
        color: '#4B4B4c',
        fontSize: 14,
        width:'85%',
        textAlign: 'center',
    },
    emptyImage: {
        height: "70%", 
        width: "100%",  
        alignSelf: "center", 
        marginTop: '-5%',
    },
    modalContainer2: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    modalContent2: {
        width: '100%',
        height: 'auto',
        marginTop:'0%',
        paddingTop:20,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation:10,
    },
    modalTitle2: {
        fontSize: 24,
        textTransform:'uppercase',
        fontWeight: '800',
        textAlign:'center',
        width:'75%',
        alignSelf:'center',
        padding:2,
        borderRadius:10,
        marginBottom:20,
        marginTop:-10,
        color:'#fff',
        backgroundColor:'#00CC76',
        textShadowColor: '#7b7b7b',
        textShadowOffset: { width: -1.5, height: 1 },
        textShadowRadius: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    modalTitle3: {
        fontSize: 24,
        textTransform:'uppercase',
        fontWeight: '800',
        textAlign:'center',
        width:'95%',
        alignSelf:'center',
        padding:2,
        borderRadius:10,
        marginBottom:20,
        marginTop:-10,
        color:'#fff',
        backgroundColor:'rgba(0, 141, 134, 1)',
        textShadowColor: '#7b7b7b',
        textShadowOffset: { width: -1.5, height: 1 },
        textShadowRadius: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
   
    infospreco:{
      flexDirection:'row',
      marginTop:10,
      borderBottomWidth:0.5,
      borderColor:'rgba(0, 92, 88, 0.2)',

    },
    modalTextinfs: {
        fontSize: 16,
        textAlign:'left',
        marginLeft:5,
        justifyContent:'center',
        color:'#4b4b4b',
        fontWeight:'600',
    },
    modalTextinfs3: {
        fontSize: 16,
        textAlign:'left',
        marginLeft:2,
        justifyContent:'center',
        color:'#4b4b4b',
        fontWeight:'600',
    },
    modalTextinfs2: {
        fontSize: 16,
        textAlign:'left',
        marginLeft:4,
        justifyContent:'center',
        color:'#FF3D00',
        fontWeight:'600',
    },
    modalTextEmpresa: {
        fontSize: 16,
        marginBottom: 5,
        textAlign:'center',
        justifyContent:'center',
        color:'#FF3D00',
        fontWeight:'600',
        
    },
    modalButtons: {
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: '#00CC76',
        paddingVertical:10,
        borderRadius: 10,
        marginBottom:10,
        marginTop:10,
        alignSelf:'center',
        width:'90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        
    },
    PinInfo:{
        position:'absolute',
        paddingLeft:2,
        paddingTop:2,
    },
    PinCheck:{
        position:'absolute',
        paddingLeft:2,
        zIndex:2,
        paddingTop:2,
    },
    containerCaixa01:{
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        backgroundColor:'#f0f0f0',
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
    }, 
    modalText4: {
        fontSize: 14,
        textAlign:'center',
        marginLeft:5,
        justifyContent:'center',
        color:'#4b4b4b',
        backgroundColor:'#f0f0f0',
        fontWeight:'400',
        padding:12,
    },
    modalText2: {
        fontSize: 14,
        textAlign:'center',
        marginLeft:5,
        justifyContent:'center',
        color:'#4b4b4b',
        fontWeight:'400',
        padding:12,
    },
    cobrançaContainer:{
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        backgroundColor:'#f0f0f0',
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
    }, 
    modalText3: {
        fontSize: 14,
        textAlign:'center',
        marginLeft:5,
        justifyContent:'center',
        color:'#4b4b4b',
        fontWeight:'400',
        padding:12,
    },
    modalButton2: {
        backgroundColor: 'transparent',
        position:'absolute',
        marginTop:'-4%',
        marginLeft:'93%',
        width:'7%',
        height:'auto',
        paddingBottom:3,
        
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign:'center',
        textShadowColor: '#7b7b7b',
        textShadowOffset: { width: -1.5, height: 1 },
        textShadowRadius: 1,
    },

    alinharCity1:{
        flexDirection:'row',
        backgroundColor:'#f0f0f0',
        width:'27%',
        marginTop:5,
        borderRadius:5,
        marginLeft:37,
        padding:2,
    },
    textCity1:{
        fontSize:10,
        width:'100%',
        color:'#4b4b4b',
        marginLeft:2,
        
    },
    alinharCity2:{
        flexDirection:'row',
        backgroundColor:'#f0f0f0',
        width:'30%',
        position:'absolute',
        marginTop:5,
        borderRadius:5,
        marginLeft:'61.5%',
        marginTop:'56.4%',
        padding:2,
    },
    textCity2:{
        fontSize:10,
        width:'100%',
        color:'#4b4b4b',
        marginLeft:2,
        
    },
});
