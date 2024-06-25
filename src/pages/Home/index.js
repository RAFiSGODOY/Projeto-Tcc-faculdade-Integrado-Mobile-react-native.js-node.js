import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, KeyboardAvoidingView, Platform, Image, StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import Loading2 from '../../components/Loading2';
import circleImage from '../../assets/Rafael(1).png';
import OnibusImagem from '../../assets/onibusimg.jpg';

export default function Home() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [modalColor, setModalColor] = useState('#FF0000');
    const [userCpf, setUserCpf] = useState('');
    const [userTell, setUserTell] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userImage, setUserImg] = useState('');
    const [idEmpresa, setIdEmpresa] = useState('');
    const [nomeDono, setNomeDono] = useState('');
    const [Telefone, setTelefone] = useState('');
    const [emailempresa, setEmailEmpresa] = useState('');
    const [imagemEmpresa, setImagemEmpresa] = useState('');
    const [preco, setPreco] = useState('');
    const [empresaNome, setEmpresaNome] = useState('');
    const [imagemPerfil, setImagemPerfil] = useState(circleImage);
    const [empresaEncontrada, setEmpresaEncontrada] = useState([]);
    const [mensagem, setMensagem] = useState('Usuário sem contrato ativo...');
    const [showModal, setShowModal] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [errorTotais, setErrorTotais] = useState('');
    const [empresa, setEmpresa] = useState([]);
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const route = useRoute();
    const [showDetails, setShowDetails] = useState(false);
    const [showCopyOptionsTell, setShowCopyOptionsTell] = useState(false);
    const [showSendMessageOptionsTell, setShowSendMessageOptionsTell] = useState(false);
    const [showCopyOptionsEmail, setShowCopyOptionsEmail] = useState(false);
    const [showSendMessageOptionsEmail, setShowSendMessageOptionsEmail] = useState(false);

  
    const enviarMensagemTelefone = () => {
        const phoneNumber = `tel:${Telefone}`;
        Linking.openURL(phoneNumber).catch(err => console.error('Erro ao enviar mensagem:', err));
    };
    
    const enviarMensagemEmail = () => {
        const emailUrl = `mailto:${emailempresa}`;
        Linking.openURL(emailUrl).catch(err => console.error('Erro ao enviar e-mail:', err));
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
    function formatarTelefone(numero) {
        const numeroLimpo = String(numero ?? '').replace(/\D/g, ''); // Converte para string e remove não numéricos

        if (numeroLimpo.length === 11) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        } else {
            return numeroLimpo;
        }
    }
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
                    console.log("Usuario:",userResponse.data)
                    setUserName(userResponse.data.nome);
                    setUserCpf(userResponse.data.cpf);
                    setUserEmail(userResponse.data.email);
                    setUserTell(userResponse.data.telefone);
                    setUserImg(userResponse.data.image_url);
                    setImagemEmpresa(userResponse.data.image_url);
                    setNomeDono(userResponse.data.donoEmpresa);
                    setEmailEmpresa(userResponse.data.emailEmpresa);
                    setTelefone(userResponse.data.telefoneEmpresa);
                    if (userImage && isValidUrl(userImage)) {
                        setImagemPerfil({ uri: userImage });
                    }
                    const servicos = empresaResponse.data;
                    console.log("Empresa:",servicos);
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
    }, [userImage]);
    function isValidUrl(urlString) {
        try {
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    }
    const cancelarContrato = async (idEmpresa) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token && idEmpresa) {
                const response = await api.delete(`/client/contrato/${idEmpresa}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Contrato cancelado com sucesso:", response.data);
                showAndHideSuccess('Contrato Cancelado!');
                setShowModal(false);
                setCarregando(true);
                setTimeout(() => {
                    setErrorTotais('');
                    navigation.navigate('Procurar')
                }, 1500);


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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar transparent barStyle="dark-content" />
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
                            <Feather name="alert-triangle" size={32} color={'#DC2626'} style={styles.IconAlert} />
                            <Text style={styles.modalTitle}>Cancelar seu contrato?</Text>
                            <Text style={styles.modalMessage}>
                                Deseja realmente cancelar seu serviço de transporte contratado com a empresa: {empresaNome}? Você será redirecionado a tela de "Procurar" e irá perder acesso a essa tela.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButtonConfirm2} onPress={() => setShowModal(false)}>
                                    <Text style={styles.modalButtonText2}>CANCELAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonConfirm} onPress={() => cancelarContrato(idEmpresa)}>
                                    <Text style={styles.modalButtonText}>CONFIRMAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
            <Modal visible={showModalInfo} transparent animationType="fade">
                <SafeAreaView style={styles.modalContainerInfo}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.modalContentInfo}>
                            <Feather name="info" size={32} color={'#005C58'} style={styles.IconInfo} />
                            <Text style={styles.modalTitleInfo}>INFORMAÇÕES DO SEU CONTRATO</Text>
                            {empresa.map((servico, index) => (
                                <Animatable.View key={index} >
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
                                        <Text style={styles.SservicoEmpresa}>R$: {servico.total}</Text>
                                    </View>
                                </Animatable.View>
                            ))}
                            <View style={styles.modalButtonsInfo}>
                                <TouchableOpacity style={styles.modalButtonConfirm2Info} onPress={() => setShowModalInfo(false)}>
                                    <Text style={styles.modalButtonText2}>FECHAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonConfirmInfo} onPress={() => { setShowModal(true), setShowModalInfo(false) }}>
                                    <Text style={styles.modalButtonText}>CANCELAR MEU CONTRATO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
            {carregando ? (
                <Loading2 />
            ) : empresa.length > 0 ? (
                <View>
                    <View style={styles.header}>
                        <View style={styles.formHeader}>
                            <TouchableOpacity style={styles.configIcon} onPress={() => navigation.navigate('Configuracoes')}>
                                <Feather name="settings" size={22} color={'#ffff'} style={styles.settingsIcon} />
                            </TouchableOpacity>
                            <Image source={imagemPerfil} style={styles.imagemPerfil} onError={() => setImagemPerfil(circleImage)} />
                            <Text style={styles.welcomeText}>Olá, </Text>
                            <Text style={styles.usernameText}>{userName}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.SuaEmpresa}>Empresa contratada</Text>
                        <View style={styles.ImagemEmpresaContainer}>
                            <Image source={OnibusImagem} style={styles.imagemEmpresaFront} />
                            <Text style={styles.EmpresaNomeImg}>
                                {empresaNome}
                            </Text>
                        </View>
                        <Text style={styles.SuaEmpresa}>Informações </Text>
                        <View style={styles.ContainerNomeProprietario}>
                            <Feather name="briefcase" size={16} color={'#005C58'} style={styles.PinProcurar} />
                            <Text style={styles.InformaCampo}>Proprietário da Empresa:</Text>
                            <Text style={styles.NomeProprietario}>{nomeDono}</Text>
                        </View>
                        <View style={styles.ContainerNomeProprietario} >
                            <Feather name="phone" size={16} color={'#005C58'} style={styles.PinProcurar} />
                            <Text style={styles.InformaCampo2}> Telefone para contato:</Text>
                            <Text style={styles.NomeProprietario2}>{formatarTelefone(Telefone)}</Text>
                        </View>
                        <View style={styles.Flex}>
                            <Animatable.View
                                animation={showCopyOptionsTell ? 'fadeIn' : 'fadeOut'}
                                duration={300}
                                style={[styles.OpcoesContainer, { display: showCopyOptionsTell ? 'flex' : 'none' }]}
                            >
                                <TouchableOpacity style={styles.OpcoesButton}  >
                                    <Text style={styles.OpcaoTexto2}>Copiar Telefone</Text>
                                    <Feather name="copy" size={16} color={'#005C58'} style={styles.PinOpções} />
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View
                                animation={showCopyOptionsTell ? 'fadeIn' : 'fadeOut'}
                                duration={300}
                                style={[styles.OpcoesContainer2 ,{ display: showCopyOptionsTell ? 'flex' : 'none' }]}
                            >
                                <TouchableOpacity style={styles.OpcoesButton2} onPress={() => { }}>
                                    <Text style={styles.OpcaoTexto}>Enviar Mensagem</Text>
                                    <Feather name="send" size={16} color={'#005C58'} style={styles.PinOpções} />
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>

                        <View style={styles.ContainerNomeProprietario} >
                            <Feather name="mail" size={16} color={'#005C58'} style={styles.PinProcurar} />
                            <Text style={styles.InformaCampo3}> E-mail para Contato:</Text>
                            <Text style={styles.NomeProprietario3}>{emailempresa}</Text>
                        </View>
                        <View style={styles.Flex}>
                            <Animatable.View
                                animation={showCopyOptionsEmail ? 'fadeIn' : 'fadeOut'}
                                duration={300}
                                style={[styles.OpcoesContainer, { display: showCopyOptionsEmail ? 'flex' : 'none' }]}
                            >
                                <TouchableOpacity style={styles.OpcoesButton} onPress={() => { }}>
                                    <Text style={styles.OpcaoTexto2}>Copiar E-mail</Text>
                                    <Feather name="copy" size={16} color={'#005C58'} style={styles.PinOpções} />
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View
                                animation={showCopyOptionsEmail? 'fadeIn' : 'fadeOut'}
                                duration={300}
                                style={[styles.OpcoesContainer2 ,{ display: showCopyOptionsEmail ? 'flex' : 'none' }]}
                            >
                                <TouchableOpacity style={styles.OpcoesButton2} onPress={() => { }}>
                                    <Text style={styles.OpcaoTexto}>Enviar Mensagem</Text>
                                    <Feather name="send" size={16} color={'#005C58'} style={styles.PinOpções} />
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>



                        <Animatable.View style={styles.container1}>
                            <Text style={styles.textnenhumservico}>Contrato Ativo</Text>
                            <View style={styles.circuloverde}></View>
                            <TouchableOpacity style={styles.DetalhesButton} onPress={() => setShowModalInfo(true)}>
                                <Feather style={styles.IconeShow} name='help-circle' size={16} color="#ffff" />
                            </TouchableOpacity>

                        </Animatable.View>

                    </View>
                </View>
            ) : (
                <View>

                </View>
            )}
            <View style={styles.Navigator}>
                <TouchableOpacity style={styles.NavigationHome} onPress={() => navigation.navigate('Procurar')}>
                    <Feather name="search" size={20} color={'#005C58'} style={styles.PinProcurar} />
                    <Text style={styles.NavigationProcurarText}>Procurar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.NavigationProcurar} onPress={() => navigation.navigate('Home')}>
                    <Feather name="briefcase" size={20} color={'#ffff'} style={styles.PinProcurar} />
                    <Text style={styles.NavigationProcurarT}>Contrato</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    NomeProprietario: {
        fontSize: 14,
        width: '55%',
        color: '#00413E'
    },
    Flex:{
        flexDirection:'row',
        alignSelf:'center',
        width:'95%'
    },
    NomeProprietario2: {
        fontSize: 14,
        width: '55%',
        color: '#00413E',
        

    },
    PinOpções:{
        marginTop:2,
    },
    OpcaoTexto:{
        width:'80%',
        textAlign:'center',
        color:'#005C58',
    },
    OpcaoTexto2:{
        width:'75%',
        textAlign:'center',
        color:'#005C58',
    },
    Opçoes: {
        position: 'absolute',
        right: 0,
        marginTop: 10,
        
    },
    OpcoesButton:{
        flexDirection:'row-reverse',
        justifyContent:'space-around',
        width:'100%',
        marginRight:0,
    },
    OpcoesButton2:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginLeft:0,
    },
    OpcoesContainer: {
        width: '50%',
        backgroundColor: '#f0f0f0',
        marginTop: 5,
        borderTopLeftRadius:10,
        padding:5,
        borderBottomLeftRadius:10,
    },
    OpcoesContainer2: {
        width: '50%',
        backgroundColor: '#f0f0f0',
        marginTop: 5,
        padding:5,
        borderLeftWidth:0.5,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
    },
    NomeProprietario3: {
        fontSize: 14,
        width: '59%',
        color: '#00413E',
    },

    InformaCampo: {
        fontSize: 12,
        width: '40%',
        marginLeft: 5,
        marginTop: 2,
        color: '#00413E'
    },
    InformaCampo2: {
        fontSize: 12,
        width: '37%',
        marginLeft: 5,
        marginTop: 2,
        color: '#00413E'
    },
    InformaCampo3: {
        fontSize: 12,
        width: '33%',
        marginLeft: 5,
        marginTop: 2,
        color: '#00413E'
    },

    ContainerNomeProprietario: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        elevation: 5,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 15,
    },
    imagemEmpresaFront: {
        width: '100%',
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: 10,
        position: 'absolute',
        height: '100%',
        zIndex: 5,
    },
    SuaEmpresa: {
        marginTop: 20,
        marginBottom: 5,
        width: '95%',
        fontSize: 12,
        textTransform: 'uppercase',
        color: '#4b4b4b',
        borderBottomWidth: 0.5,
        borderColor: '#c3c3c3',
        textAlign: 'left',
        alignSelf: 'center',
    },
    imagemPerfil: {
        width: 40,
        height: 40,
        zIndex: 2,
        marginTop: 0,
        borderRadius: 20,
        marginRight: 10,
    },
    EmpresaNomeImg: {
        fontSize: 42,
        alignSelf: 'center',
        textAlign: 'center',
        width: '100%',
        zIndex: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        marginTop: 40,
        marginBottom: 40,
        letterSpacing: 30,
        color: '#fff',
        textTransform: 'uppercase',
    },
    modalContainer2: {
        width: "100%",
        opacity: 1,
        top: '86%',
        alignSelf: "center",

    },
    ImagemEmpresaContainer: {
        backgroundColor: '#f0f0f0',
        width: '95%',
        height: 'auto',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 10,
    },
    modalButton2: {
        backgroundColor: 'transparent',
        marginTop: '-1%',
        marginLeft: '95%',
        width: '7%',
        height: 'auto',
        paddingBottom: 3,

    },
    modalContent2: {
        height: '25%',
        width: '95%',
        borderRadius: 5,
        marginLeft: 10,

    },
    modalMessage2: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        justifyContent: 'center',
        paddingTop: 14,
        color: "white",


    },
    IconAlert: {
        backgroundColor: '#FEE2E2',
        width: 50,
        height: 50,
        justifyContent: 'center',
        padding: 7,
        marginTop: 15,
        textAlign: 'center',
        borderRadius: 50,
        alignSelf: 'center',
    },
    IconInfo: {
        width: 50,
        height: 50,
        padding: 9,
        backgroundColor: 'rgba(0, 141, 134, 0.20)',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        borderRadius: 50,
        alignSelf: 'center',
    },
    circulovermelho: {
        width: 10,
        height: 10,
        backgroundColor: 'red',
        position: 'absolute',
        borderColor: 'white',
        borderWidth: 0.5,
        right: 0,
        borderRadius: 10,
        marginRight: 10,
        padding: 10,
        marginTop: 2,
        elevation: 10,
        zIndex: 2,
    },

    modalContainerInfo: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        height: '100%',
        padding: 10,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        height: '100%',
        padding: 10,
    },
    modalContent: {
        backgroundColor: '#ffff',
        width: '90%',
        height: '45%',
        padding: 10,
        alignSelf: 'center',
        borderRadius: 0,
        marginTop: '50%',
        bottom: 0,
        borderRadius: 10,

    },
    modalContentInfo: {
        backgroundColor: '#ffff',
        width: '106%',
        height: '85%',
        padding: 20,
        alignSelf: 'center',
        borderRadius: 0,
        marginTop: '35%',
        bottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 25,
        color: '#000',
        width: '90%',
        alignSelf: 'center',
    },
    modalMessage: {
        fontSize: 14,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        width: '110%',
        fontWeight: '400',
        alignSelf: 'center',
        color: '#6B7280',
    },
    modalTitleInfo: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 5,
        color: '#000',
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    modalMessageInfo: {
        fontSize: 14,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        width: '110%',
        fontWeight: '400',
        alignSelf: 'center',
        color: '#6B7280',
    },
    modalButtonsInfo: {
        flexDirection: 'column-reverse',
        justifyContent: 'space-around',
        position: 'absolute',
        width: '100%',
        alignSelf: 'center',
        marginTop: '150%',
    },
    modalButtonConfirmInfo: {
        backgroundColor: '#DC2626',
        padding: 13,
        borderRadius: 5,
        marginTop: '0%',
        width: '90%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    modalButtonConfirm2Info: {
        backgroundColor: '#ffff',
        padding: 13,
        borderRadius: 5,
        marginTop: '4%',
        width: '90%',
        alignSelf: 'center',
        borderWidth: 0.5,
        borderColor: '#D1D5DB',

    },

    modalButtons: {
        flexDirection: 'column-reverse',
        justifyContent: 'space-around',
        marginTop: '1%',
    },
    modalButtonConfirm: {
        backgroundColor: '#DC2626',
        padding: 13,
        borderRadius: 5,
        marginTop: '0%',
        width: '90%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    modalButtonConfirm2: {
        backgroundColor: '#ffff',
        padding: 13,
        borderRadius: 5,
        marginTop: '4%',
        width: '90%',
        alignSelf: 'center',
        borderWidth: 0.5,
        borderColor: '#D1D5DB',

    },
    modalButtonText: {
        color: '#ffff',
        fontWeight: '400',
        textAlign: 'center',
        fontSize: 14,
    },
    modalButtonText2: {
        color: '#374151',
        fontWeight: '400',
        textAlign: 'center',
        fontSize: 14,
    },
    buttonCancelarContrato: {
        width: '30%',
        zIndex: 3,
        backgroundColor: '#DC2626',
        marginTop: '1%',
        marginBottom: 8,
        borderRadius: 5,
        marginLeft: 250,
        height: 'auto',
        elevation: 5,
        padding: 6,
    },
    textCancelar: {
        color: '#f0f0f0',
        textAlign: 'center',
        fontSize: 10,

    },
    flexRow: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 50,
    },
    paddingBranco: {
        padding: 10,
        height: '80%',
        marginTop: '60%',
    },
    SservicoEmpresa: {
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        letterSpacing: 5,
        fontSize: 20,
        color: '#4b4b4b',
    },
    TextAlertContratos: {
        width: '95%',
        marginTop: 30,
        borderBottomWidth: 0.5,
        color: '#00413E',
        fontSize: 12,
        textTransform: 'uppercase',
        textAlign: 'left',
        alignSelf: 'center',
    },
    SnomeEmpresaContainer: {
        alignSelf: 'center',
        width: '95%',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        padding: 5,
    },
    SservicoEmpresa1: {
        width: '93%',
        color: '#00413E',
        fontSize: 10,
        marginLeft: 0,
        textTransform: 'uppercase',
        textAlign: 'flex-end',
    },
    SnomeEmpresa: {
        marginTop: 10,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        width: '95%',
        alignSelf: 'center',
        borderColor: '#00413E',


    },
    DetalhesButton: {
        position: 'absolute',
        marginTop: '0%',
        zIndex: 2,
        padding: 10,
        height: 46,
        marginLeft: '77%',
        //backgroundColor: 'white',
        borderRadius: 5,

    },
    circuloverde: {
        width: 10,
        height: 10,
        backgroundColor: '#31F600',
        position: 'absolute',
        borderColor: 'white',
        borderWidth: 0.5,
        right: 0,
        borderRadius: 10,
        marginRight: '88%',
        marginTop: 13,
        zIndex: 2,

    },
    paginaindisponivel: {
        fontSize: 28,
        width: '100%',
        color: '#343434',
        textAlign: 'center',
        marginBottom: 10,
    },
    contrateUmaEmpresa: {
        fontSize: 14,
        width: '100%',
        color: '#343434',
        textAlign: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: 'rgba(0, 141, 134, 1)',
        borderRadius: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '80%',
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
        marginRight: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#F0F0F0',
        height: '50%',
        borderRadius: 10,


    },
    textnenhumservico: {
        color: '#fff',
        borderColor: '#c3c3c3',
        fontSize: 12,
        textAlign: 'center',
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#00CC76',
        borderRadius: 5,
        width: '100%',
        justifyContent: 'center',
        elevation: 5,
        zIndex: 2,
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 25,
    },
    Navigator: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: '199.2%',
        width: '100%',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        padding: 5,
    },
    NavigationProcurar: {
        backgroundColor: 'rgba(0, 141, 134, 1)',
        width: '52.6%',
        borderRadius: 0,
        padding: 2,
    },
    NavigationHome: {
        backgroundColor: '#f0f0f0',
        width: '52.6%',
        borderRadius: 0,
        padding: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    PinProcurar: {
        alignSelf: 'center',
    },
    NavigationProcurarText: {
        textAlign: 'center',
        color: '#00413E',
        fontSize: 10,
    },
    NavigationProcurarT: {
        textAlign: 'center',
        color: '#ffff',
        fontSize: 10,
    },
    configIcon: {
        position: 'absolute',
        width: '94%',
        marginTop: 13,
        marginLeft: 20,
    },
    settingsIcon: {
        alignSelf: 'flex-end',
    },

    PinValor: {
        marginRight: 5,
        marginLeft: 5,
    },
    infoptext: {
        color: '#fff',
        width: '150%',
        fontSize: 12,
    },
    infoptext2: {
        color: '#fff',
        width: '100%',
        fontSize: 12,
    },
    infoptext3: {
        color: '#fff',
        width: '100%',
        fontSize: 12,
    },
    infospessoais: {
        flexDirection: 'row',
        marginTop: 5,
        width: '100%',
        marginLeft: 5,
    },
    infospessoais2: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 5,
        width: '40%',
    },
    infospessoais3: {
        flexDirection: 'row',
        marginLeft: 5,
        marginTop: 5,
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
    container1: {
        marginTop: '167%',
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 0,
        marginLeft: '58%',
        borderRadius: 10,
        width: '40%',
        height: 'auto',
        elevation: 2,
    },
    formHeader: {
        flexDirection: 'row',
        marginTop: 10,
        width: '98%',
        backgroundColor: 'rgba(0, 141, 134, 1)',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'left',
        padding: 5,
        borderRadius: 20,
    },
    empresacontratada: {

    },
    InfoEmpresaBack: {

    },
    InfoEmpresa: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginTop: '5%',
        textAlign: 'center',
    },

    InfosE: {
        color: '#fff',
        paddingBottom: 10,
        paddingTop: 10,
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 5,
        textTransform: 'uppercase',
    },

    Nomeempresa: {
        color: '#fff',
        paddingBottom: 10,
        paddingTop: 10,
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 5,
        textTransform: 'uppercase',
    },
    welcomeText: {
        fontSize: 20,
        marginTop: 5,
        fontWeight: '600',
        color: '#fff',
    },
    usernameText: {
        fontSize: 18,
        marginTop: 7,
        fontWeight: '600',
        color: '#fff',


    },


});
