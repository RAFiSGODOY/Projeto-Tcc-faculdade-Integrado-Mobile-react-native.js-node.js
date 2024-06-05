import React, { useState, useEffect} from 'react';
import { View, Text, TextInput,Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import SearchContrato from '../../assets/SearchContrato.jpg';
import Onibus from '../../assets/semfundo.png';
import moment from 'moment-timezone';

export default function Procurar() {
    const navigation = useNavigation();
    const [rotaInicio, setRotaInicio] = useState('');
    const [rotaFim, setRotaFim] = useState('');
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
    
      const showAndHideSuccess = (message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#00A925');
        setTimeout(() => {
          setShowModal(false);
          setErrorTotais('');
        }, 1500);
      };
    useEffect(() => {
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
                        setContratos(contratosResponse.data);
                        setMensagem('');
                        setTemContratosAtivos(true);
                        console.log("desativei")
                    } else {
                        setContratos([]);
                        setMensagem('Nenhum Serviço Encontrado');
                        setTemContratosAtivos(false);
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
    
        fetchUserData();
    }, []);
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
                setTemContratosAtivos(true);
                showAndHideSuccess("Contrato aceito com sucesso!");
                setEtapa(2);
            }
        } catch (error) {
            console.log('Erro ao criar contrato:', error.message);
            
            showAndHideError("Erro ao criar contrato, Tente novamente mais tarde!");
        }
    };
    
    
    
    
    
    
    const formatarPreco = (preco) => {
        let formatted = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return formatted.slice(0, -3);
    };
    
   
    
    const buscarServicosOferta = async () => {
        setIsLoading(true);
        console.log(rotaFim, rotaInicio);
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
                showAndHideError("Nenhum Serviço Encontrado");
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
            console.log('Usuário já possui contratos ativos. Não é possível contratar um novo serviço.');
            showAndHideError("Você já possui um Contrato Ativo!");
            return; 
        }
        setSelectedServico(servico);
        setValorTotal(servico.preco);
        console.log(valorTotalPreco)
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedServico(null);
    };

            

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
                        <Text style={styles.TextHeader}>Encontre o Melhor Serviço</Text> 
                    </View>
                <Animatable.View animation="fadeInDown" duration={800} style={styles.formContainer}>
                    
                    <View style={styles.InputContainer}>
                        <Feather name="map-pin" size={22} color={'#42E619'} style={styles.Pin} />
                        <TextInput
                            placeholder="Cidade de Partida"
                            placeholderTextColor="#7C7C7C"
                            style={styles.inputEndereco}
                            onChangeText={(text) => setRotaInicio(text)}
                        />
                    </View>
                    <Text style={styles.infoDica}>Dica: Informe a Cidade onde sua Instituição de Ensino é localizada.</Text>
                    <View style={styles.InputContainer2}>
                        <Feather name="map-pin" size={22} color={'#E9ED19'} style={styles.Pin} />
                        <TextInput
                            placeholder="Cidade de Destino"
                            placeholderTextColor="#7C7C7C"
                            style={styles.inputEndereco}
                            onChangeText={(text) => setRotaFim(text)}
                        />
                    </View>
                    <Text style={styles.infoDica2}>Dica: Informe a Cidade no qual deseja embarcar no transporte com destino a sua Instituição de Ensino.</Text>
                    <TouchableOpacity style={styles.button} onPress={buscarServicosOferta}>
                        <Text style={styles.buttontext}>{isLoading ? 'Buscando...' : 'Pesquisar '}</Text>
                        <Feather name="search" size={22} color={'#ffff'} style={styles.PinSearch} />
                    </TouchableOpacity>
                </Animatable.View >
                <Animatable.View animation="fadeInUp" duration={800} style={styles.resultsContainer}>
                    {servicosEncontrados.length > 0 ? (
                        <ScrollView style={styles.servicosContainer} showsVerticalScrollIndicator={false}>
                            {servicosEncontrados.map((servico, index) => (
                                <TouchableOpacity 
                                key={index} 
                                style={[
                                    styles.servicoItem, 
                                    contratos.length > 0 && styles.disabledButton
                                ]} 
                                onPress={() => contratos.length === 0 && openModal(servico)}
                                disabled={contratos.length > 0}
                            >
                                        <View style={styles.empresapin}>
                                         <Feather name="briefcase" size={18} color={'#005C58'} style={styles.PinEmpresa} />
                                        <Text style={styles.precoSimbolo}>R$:</Text>
                                        <Text style={styles.servicoPreco}>{formatarPreco(servico.preco)},00</Text>
                                        </View>
                                        <View style={styles.Rotas}>
                                            <View style={styles.rtI}>
                                                <Feather name="map-pin" size={20} color={'#42E619'} style={styles.Pin2} />
                                                <Text style={styles.servicoRotaInicio}>{servico.rota_inicio}</Text>
                                            </View>
                                            <Text style={styles.Pin3}>X</Text>
                                            <View style={styles.rtF}>
                                                <Text style={styles.servicoRotaFim}>{servico.rota_fim}</Text>
                                                <Feather name="map-pin" size={20} color={'#E9ED19'} style={styles.Pin4} />
                                            </View>
                                        </View> 
                                        <View style={styles.precoContainer}>
                                       
                                        <Text style={styles.servicoEmpresa}>{servico.nomeEmpresa}</Text> 
                                    </View>
                                    
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text></Text>
                    )}
                </Animatable.View>
            </View>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer2}>
                    
                    <View style={styles.modalContent2}>
                        {selectedServico && etapa == 1 && (
                           
                            <Animatable.View animation="fadeInUp" delay={100}>
                                <Text style={styles.modalTitle2}>Gostaria de Contratar a {selectedServico.nomeEmpresa}?</Text>
                                <Text style={styles.modalText2}>As informações do Contrato selecionado serão listadas a baixo, clique em "CONTRATAR EMPRESA" somente se estiver com certeza de sua decisão!</Text>
                                
                                <View style={styles.infoHeaderModal}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText}>ROTA ESCOLHIDA</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.RotasEscolhida}>
                                            <View style={styles.rtI}>
                                                <Feather name="map-pin" size={20} color={'#42E619'} style={styles.Pin2} />
                                                <Text style={styles.servicoRotaInicio}>{selectedServico.rota_inicio}</Text>
                                            </View>
                                            <Text style={styles.Pin5}>X</Text>
                                            <View style={styles.rtF}>
                                                <Text style={styles.servicoRotaFim}>{selectedServico.rota_fim}</Text>
                                                <Feather name="map-pin" size={20} color={'#E9ED19'} style={styles.Pin4} />
                                            </View>
                                </View> 
                                <View style={styles.infoHeaderModal2}>
                                <View style={styles.line1} />
                                <Text style={styles.infoHeaderText2}>INFORMAÇÕES DO PAGAMENTO</Text>
                                <View style={styles.line2} />
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="dollar-sign" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Valor R$:</Text>
                                <Text style={styles.modalTextinfs2}>{formatarPreco(selectedServico.preco)}</Text>
                                <Text style={styles.modalTextinfs3}>reais.</Text>
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="calendar" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Tipo de Pagamento:</Text>
                                <Text style={styles.modalTextinfs2}>Mensal</Text>
                                <Text style={styles.modalTextinfs3}>.</Text>
                                </View>
                                <View style={styles.infospreco}>
                                <Feather name="pie-chart" size={20} color={'#005C58'} style={styles.PinValor} />
                                <Text style={styles.modalTextinfs}>Duração do Contrato</Text>
                                <Text style={styles.modalTextinfs2}>1</Text>
                                <Text style={styles.modalTextinfs3}>ano.</Text>
                                </View>
        
                                <View style={styles.modalButtons}>

                                    <TouchableOpacity style={styles.modalButton} onPress={acceptService}>
                                        <Text style={styles.modalButtonText}>CONTRATAR EMPRESA</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton2} onPress={closeModal}>
                                        <Text style={styles.modalButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                             
                            </Animatable.View>
                        
                        )}{selectedServico && etapa == 2 && (
                           
                            <Animatable.View animation="fadeInUp" delay={200}>
                             
                                <Text style={styles.modalTitle2}>Obrigado por escolher UniBus!</Text>
                                <Text style={styles.modalText2}>Parabéns! Você agora possui um Contrato de Transporte com a empresa:</Text>
                                <Text style={styles.modalTextEmpresa}>"{selectedServico.nomeEmpresa}"</Text>
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

                                    <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                                        <Text style={styles.modalButtonText}>Confirmar e sair</Text>
                                    </TouchableOpacity>
                                </View>
                             
                            </Animatable.View>
                        
                        )}
                    </View>
                </View>
           
            </Modal> 
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 141, 134, 0.050)',
        
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
    backgroundImage: {
        height: "85%", 
        width: "100%",  
        position: 'absolute',
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding:10,
        position:'absolute',
        width:'90%',
        backgroundColor:'#fff',
        borderRadius:15,
        alignSelf:'center',
        marginTop:'40%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 5,
        position:'absolute',
        height:'50%',
        width:'100%',
        marginTop:'116%',
        marginLeft:'0%',
    },
    InputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        marginTop: '5%',
        height: 50,
        alignSelf: 'center',
        paddingHorizontal: 10,
        
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
    PinSearch:{
        marginLeft:'25%',
        marginRight:'-32%',
    },
    PinEmpresa:{
       marginRight:5,
       backgroundColor:'white',
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
        backgroundColor: 'rgba(0, 141, 134, 1)',
        borderRadius: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10,
        width: '90%',
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
        color: 'white',
        fontWeight: 'bold',
    },
    inputEndereco: {
        flex: 1,
        fontSize: 16,
        color: '#7C7C7C',
        textAlign: 'center',
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
        backgroundColor: '#ffff',
        borderRadius: 5,
        marginBottom: 10,
        padding:5,
        marginLeft:5,
        marginRight:5,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    
    servicoEmpresa: {
        color: '#008B85',
        textAlign: 'center',
        width:'100%',
        letterSpacing:3,
        alignSelf:'center',
        fontSize: 16,
        fontWeight: '900',
        paddingBottom: 0,
        marginTop:2,
    },
    precoContainer:{
     flexDirection:'row',
     paddingTop: 5,
     marginTop: 10,
     borderTopWidth:0.5,
     borderColor:'#6c6c6c',
    },
    servicoPreco: {
        color: '#343434',
        marginLeft:'85%',
        letterSpacing:0.5,
        width:'15%',
        position:'absolute',
    },
    precoSimbolo:{
        width:'7%',
        marginLeft:'78%',
        color:'#343434',
        letterSpacing:0.5,
        position:'absolute',
       
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
        color: '#4B4B4B',
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
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    modalContent2: {
        width: '100%',
        height: 'auto',
        marginTop:'95%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalTitle2: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign:'center',
        borderTopLeftRadius: 10,
        paddingVertical:5,
        textShadowColor: 'rgba(0, 0, 0, 0.55)',
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 7,
        borderTopRightRadius: 10,
        color:'white',
        backgroundColor: '#008B85',
    },
    modalText2: {
        fontSize: 16,
        textAlign:'center',
        justifyContent:'center',
        color:'#4b4b4b',
        fontWeight:'400',
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
        backgroundColor: '#008B85',
        paddingVertical:5,
        borderRadius: 5,
        marginBottom:10,
        alignSelf:'center',
        width:'95%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        
    },
    modalButton2: {
        backgroundColor: '#FF3D00',
        paddingVertical:5,
        borderRadius: 5,
        marginBottom:20,
        alignSelf:'center',
        width:'95%',
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6,
        
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign:'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 7,
    },
});
