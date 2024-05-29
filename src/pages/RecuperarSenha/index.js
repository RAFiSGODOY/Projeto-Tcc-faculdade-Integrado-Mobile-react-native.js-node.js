import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Keyboard, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { useRoute } from '@react-navigation/native';
import api from '../services/api';
import { StatusBar } from 'react-native';
import ProgressBar from './progressBar';
import ForgotPassword from '../../assets/ForgotPassword.jpg';
import ForgotEmail from '../../assets/email.jpg';
import Forgotcodigo from '../../assets/codigo.jpg';
import seguranca from '../../assets/segurança-02.jpg';
import seguranca2 from '../../assets/password.jpg';
import obrigado from '../../assets/obrigado.jpg';


export default function RecuperarSenha() {
    const route = useRoute();
    const navigation = useNavigation();
    const [etapa, setEtapa] = useState(0);
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [emailconfirmado, setEmailConfirmado] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [newpasswordconfirmado, setNewConfirmarpassword] = useState('');
    const [camposObrigatorios, setCamposObrigatorios] = useState([]);
    const [modalColor, setModalColor] = useState('#FF0000');
    const [errorTotais, setErrorTotais] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [codigoEnviado, setCodigoEnviado] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const avançarEtapa = () => {
        setEtapa(1);
    }
    const validaremail = () => {
        if(email === emailconfirmado){
            return true;
        }else {
            return false;
        }
    }

    const proximaEtapa = async () => {
        if(etapa === 1){
            if(!email){
                showAndHideError('Informe seu E-mail!');
                verificarCamposObrigatorios();
                
            }else if (email){
                    setEtapa(2);
            
            }

        }else if (etapa === 2 && emailconfirmado) {
            if (validaremail()) {
                setIsLoading(true); // Inicia o estado de carregamento
                await mandarCodigoRecuperacao();
                setIsLoading(false);
            } else {
                showAndHideError('Os E-mails precisam ser iguais!');
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    setEtapa(1);
                }, 1500);
            } 
        } else if (etapa === 3 && codigo) {
            if (codigoEnviado && codigo === codigoEnviado.toString()) { 
                showAndHideCorreto('Código Validado!');
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    setEtapa(4);
                }, 1500);
            } else {
                showAndHideError('Código incorreto!');
            }
        } else if (etapa === 4 && newpassword ) {
            if(!newpassword){
                showAndHideError('Informe sua nova Senha!');
                verificarCamposObrigatorios();
            }else if (newpassword){
                    setEtapa(5);
               
            }
        } else {
            verificarCamposObrigatorios();
            showAndHideError('Preencha todos os campos obrigatórios!');
        }
    };

    const showAndHideError = useCallback((message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#FF0000');
        setTimeout(() => {
            setShowModal(false);
            setErrorTotais('');
        }, 2000);
    }, []);

    const showAndHideCorreto = useCallback((message) => {
        setErrorTotais(message);
        setShowModal(true);
        setModalColor('#00A925');
        setTimeout(() => {
            setShowModal(false);
            setErrorTotais('');
        }, 1500);
    }, []);
    const  mandarCodigoRecuperacao = async () => {
        try {
            const response = await api.post('/reset-code', { email });
            console.log('Resposta do servidor:', response.data);
            if (response.data && response.data.code) {
                setCodigoEnviado(response.data.code);
                showAndHideCorreto('Código Enviado com Sucesso!');
                console.log("Código enviado salvo na variável:", response.data.code);
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    setEtapa(3);
                }, 1500);
            } else {
                showAndHideError('Erro ao enviar código!');
            }
        } catch (error) {
            showAndHideError('E-mail não Cadastrado!');
            setTimeout(() => {
                setShowModal(false);
                setErrorTotais('');
                setEtapa(1);
            }, 1500);
            verificarCamposObrigatorios();

        }
    };
    const clearFieldError = (field) => {
        setFieldErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
        });
    
        setCamposObrigatorios((prevCampos) => prevCampos.filter(campo => campo !== field));
    };

    const voltarlogin = () => {
        navigation.navigate('SignIn');
    }

        
    const verificarCamposObrigatorios = useCallback(() => {
        let camposFaltando = [];
        let errors = {};
        if (etapa === 1) {
            if (!email) {
                camposFaltando.push('email');
                errors.email = 'Preencha seu E-mail!';
            }
        }else if (etapa === 2) { 
            if (!emailconfirmado) {
                camposFaltando.push('emailconfirmado');
                errors.emailconfirmado = 'Confirme seu E-mail!';
            }
            
        } else if (etapa === 3) {
            if (!codigo) {
                camposFaltando.push('codigo');
                errors.codigo = 'Informe o Código enviado ao seu E-mail!';
            }
        } else if (etapa === 4) {
            if (!newpassword) {
                camposFaltando.push('newpassword');
                errors.newpassword = 'Informe uma nova senha!';
            }
        } else if (etapa === 5) {
            if (!newpasswordconfirmado) {
                camposFaltando.push('newpasswordconfirmado');
                errors.newpasswordconfirmado = 'Confirme a sua nova senha!';
            }
        }

        setCamposObrigatorios(camposFaltando);
        setFieldErrors(errors);

        return camposFaltando.length === 0;
    }, [etapa, email, emailconfirmado, codigo, newpassword, newpasswordconfirmado]);

    const salvar = async () => {
        if (etapa === 5 && (newpassword && newpasswordconfirmado)) {
            setIsLoading(true);
            if (newpassword === newpasswordconfirmado) {
                try {
                    await api.post(`/client/reset-password/${codigoEnviado}`, {
                        novaSenha: newpassword,
                    });
                    console.log('Dados salvos com sucesso');
                    showAndHideCorreto('Senha Alterada!');
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowModal(false);
                        setErrorTotais('');
                        //navigation.navigate("SignIn");
                        setEtapa(6);
                    }, 1500);
                } catch (error) {
                    showAndHideError('Erro ao alterar a senha!');
                    setIsLoading(false);
                }
            } else {
                showAndHideError('As duas senhas precisam ser iguais!');
                setIsLoading(false);
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    setEtapa(4);
                }, 1500);
            }
        } else {
            showAndHideError('Informe sua senha!');
            verificarCamposObrigatorios();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="light-content"/>
            <ProgressBar progress={(etapa / 6) * 110} />
            <View style={styles.containerLogo}></View>
            <Animatable.View delay={200} animation="fadeInUp" style={styles.containerForm}>
            {etapa === 0 && (
                    <Animatable.View delay={200} animation="fadeInUp"
                    keyboardShouldPersistTaps="handled" >
                            <Text style={styles.infoHeaderText2}>Olá, por acaso esqueceu sua senha? Fique tranquilo vamos te ajudar nessa!  </Text>
                        <Image
                                source={ForgotPassword}
                                style={{ height: "65%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'5%',
                                 marginLeft:0, 
                                 position:'relative', 
                                 alignSelf:'left',
                                zIndex: 5,

                             }}
                                resizeMode='contain'
                            />
                        
                        <TouchableOpacity style={styles.buttonEtapa0} onPress={avançarEtapa}>
                            <Text style={styles.buttontext}>Recuperar minha senha</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonEtapa1} onPress={voltarlogin}>
                            <Text style={styles.buttontext}>Voltar</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
            {etapa === 1 && (
                    <Animatable.View delay={200} animation="fadeInUp"
                    keyboardShouldPersistTaps="handled" >
                        <View style={styles.infoHeader}>
                           
                            <Text style={styles.infoHeaderText2}>Ok, vamos lá, primeiro... nos diga seu e-mail usado para login:</Text>
                        
                        </View>
                        <Image
                                source={ForgotEmail}
                                style={{ height: "55%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'19%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <Text style={styles.text1}>Preencha com seu E-mail:</Text>
                        <TextInput
                            autoCapitalize={"none"}
                            
                            placeholder="E-mail"
                            onChangeText={(value) => {
                                setEmail(value);
                                clearFieldError('email');
                            }}
                            keyboardType="email-address"
                            style={[styles.campoEmail, camposObrigatorios.includes('email') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
                        <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                            <Text style={styles.buttontext}>Próxima Etapa</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 2 && (
                    <Animatable.View delay={200} animation="fadeInUp">
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoHeaderText2}>Ok... Antes de enviarmos seu código, digite novamente seu E-mail: </Text>
                        </View>
                        <Image
                                source={ForgotEmail} 
                                style={{ height: "55%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'19%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <Text style={styles.text1}>Digite novamente seu e-mail:</Text>
                        <TextInput
                            placeholder="Confirme seu E-mail"
                            onChangeText={(value) => {setEmailConfirmado(value);
                                clearFieldError('emailconfirmado');
                            }}
                           
                            keyboardType="email-address"
                            style={[styles.campoEmail, camposObrigatorios.includes('emailconfirmado') && styles.campoObrigatorio ]}
                        />
                        {fieldErrors.emailconfirmado && <Text style={styles.errorText}>{fieldErrors.emailconfirmado}</Text>}
                        <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                                <Text style={styles.buttontext}>{isLoading ? 'Carregando...' : 'Próxima etapa'}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 3 && (
                    <Animatable.View delay={200} animation="fadeInUp">
                        <View style={styles.infoHeader}>

                            <Text style={styles.infoHeaderText2}>Quase lá... Confirme o código enviado ao seu E-mail:</Text>
                        </View>
                        <Image
                                source={Forgotcodigo}
                                style={{ height: "55%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'19%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <Text style={styles.text2}>Informe o código enviado ao seu E-mail!</Text>
                        <View style={styles.Codigo}>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '999999'
                                }}
                                value={codigo}
                                onChangeText={(text) => {setCodigo(text);
                                    clearFieldError('codigo');
                                }
                                }
                                keyboardType="numeric"
                                placeholder="Código"
                                style={[styles.campoEndereco, camposObrigatorios.includes('codigo') && styles.campoObrigatorio ]}
                            />
                        </View>
                        {fieldErrors.codigo && <Text style={styles.errorText}>{fieldErrors.codigo}</Text>}
                        <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                            <Text style={styles.buttontext}>Próxima Etapa</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
                 {etapa === 4 && (
                    <Animatable.View delay={200} animation="fadeInUp">
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoHeaderText2}>Oba, código confirmado! Por favor, informe sua senha nova:</Text>
                            <Text style={styles.textHeader2}>Lembre-se... crie uma senha que você vá se lembrar e tome cuidado, não compartilhe sua senha com nínguem!</Text>
                        </View>
                        <Image
                                source={seguranca2}
                                style={{ height: "60%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'20%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <Text style={styles.text3}>Crie uma nova senha:</Text>
                        <TextInput
                                placeholder="Nova Senha"
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    clearFieldError('newpassword');
                                }}
                                
                                secureTextEntry={true}
                                style={[styles.campoSenha, camposObrigatorios.includes('newpassword') && styles.campoObrigatorio]}
                            />
                            {fieldErrors.newpassword && <Text style={styles.errorText}>{fieldErrors.newpassword}</Text>}
                            <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                            <Text style={styles.buttontext}>Próxima Etapa</Text>
                            </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 5 && (
                    <Animatable.View delay={200} animation="fadeInUp">
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoHeaderText2}>Tudo certo ! Agora  digite  novamente  sua  nova  senha:</Text>
                            <Text style={styles.textHeader2}>Tome cuidado.  Nós da UniBus jamais entraremos em contato pedindo sua senha.</Text>
                        </View>
                        <Image
                                source={seguranca}
                                style={{ height: "60%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'20%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <Text style={styles.text3}>Confirme sua nova Senha:</Text>
                        
                         <TextInput
                                placeholder="Confirmar Senha"
                                onChangeText={(text) => {
                                    setNewConfirmarpassword(text);
                                    clearFieldError('newpasswordconfirmado');
                                }}
                                
                                secureTextEntry={true}
                                style={[styles.campoSenha, camposObrigatorios.includes('newpasswordconfirmado') && styles.campoObrigatorio]}
                            />
                            {fieldErrors.newpasswordconfirmado && <Text style={styles.errorText}>{fieldErrors.newpasswordconfirmado}</Text>}

                            <TouchableOpacity style={styles.button} onPress={salvar}>
                            <Text style={styles.buttontext}>{isLoading ? 'Carregando...' : 'Próxima etapa'}</Text>
                            </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 6 && (
                    <Animatable.View delay={200} animation="fadeInUp">
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoHeaderText2}>Sua senha foi alterada com Sucesso!</Text>
                            <Text style={styles.textHeader2}>Obrigado por escolher UniBus! </Text>
                            
                        </View>
                        <Image
                                source={obrigado}
                                style={{ height: "100%", 
                                width: "100%",  alignSelf: "center",
                                 marginTop:'0%',
                                 position:'absolute', 
                                 alignSelf:'left',
                                zIndex: 0,

                             }}
                                resizeMode='contain'
                            />
                        <TouchableOpacity style={styles.buttonFinalizar} onPress={voltarlogin}>
                            <Text style={styles.buttontextFinalizar}>Ir para o Login</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
            </Animatable.View>
            <Modal visible={showModal} transparent>
                <Animatable.View animation="fadeInLeft" duration={300} style={styles.modalContainer}>
                    <Animatable.View animation="bounceIn" duration={1000} style={[styles.modalContent, { backgroundColor: modalColor }]}>
                        <Text style={styles.modalMessage}>{errorTotais}</Text>
                    </Animatable.View>
                </Animatable.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({

    text1: {
     color:'#005C58',
     textAlign:'left',
     fontSize:12,
     marginTop:'75%',
     fontWeight:'400',
    },
    text2: {
        color:'#005C58',
        textAlign:'left',
        fontSize:12,
        marginTop:'85%',
        fontWeight:'400',
       },
       text3: {
        color:'#005C58',
        textAlign:'left',
        fontSize:12,
        marginTop:'73%',
        fontWeight:'400',
       },
    textHeader2: {
        color:'#686A6A',
        textAlign:'left',
        fontSize:12,
        backgroundColor:'transparent',
        marginTop:'2%',
        marginRight:0,
        fontWeight:'400',
        width:'100%',
        zIndex:1,
       },
    errorText:{
      color:'red',
      fontWeight:'300',
      //borderTopWidth:0.5,
      //borderColor:'red',
      fontSize:12,
      marginTop:-10,
    },
    animatedStyle: {
        top: 5,
        left: 15,
        position: 'absolute',
        borderRadius: 90,
        zIndex: 10000,
      },

    campoObrigatorio: {
        borderColor: 'red',
        borderBottomWidth: 0.5, 
    },
    Traco:{
        fontSize:32,
        left:4,
        top:3,


    },
    modalContainer: {
        width: "100%",
        opacity: 1,
        top: '92%',
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
    container: {
        flex: 1,
        zIndex: 0,
        backgroundColor:"white",
    },
    infoHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 0,
        width:'100%',
        marginTop:-20,
      
    },
    Codigo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        right:8,
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
    infoHeaderText0: {
        fontSize: 25,
        color: '#005C58',
        paddingRight:0,
        fontWeight: '800',
        justifyContent:'center',
        textAlign:'center',
        width:'100%',
    },
    infoHeaderText3: {
        fontSize: 25,
        color: '#005C58',
        paddingRight:0,
        fontWeight: '800',
        justifyContent:'justify',
        textAlign:'justify',
        marginTop:'15%',
    },
    infoHeaderText2: {
        fontSize: 25,
        color: '#005C58',
        fontWeight: '800',
        textAlign:'justify',
        marginTop:'0%',
        width:'100%',
        height:'auto',
        zIndex:2,
        
    },
    campoNome: {
        paddingLeft: 0,
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        marginTop: 10,
        opacity: 1,
        color:'#00413E',
    },
    campoEmail: {
        paddingLeft: 0,
        height: 30,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        marginTop: 10,
        opacity: 1,
        color:'#00413E',
    },
    campoLogradouro: {
        paddingLeft: 0,
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        marginTop: 10,
        opacity: 1,
        color:'#00413E',
    },
    campoCPF: {
        paddingLeft: 0,
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        marginTop: 10,
        opacity: 1,
        color:'#00413E',
    },
    containerDataNascimento: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        color:'#00413E',
    },
    datanascimentotext: {
        width: '40%',
        bottom: 5,
        color: '#005C58',
    },
    campoDataNascimento: {
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        flex: 1,
        color:'#00413E',
    },
    button: {
        backgroundColor: '#005C58',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
        zIndex: 2,
    },
    buttonEtapa0: {
        backgroundColor: '#005C58',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '170%',
        alignSelf: 'center',
        zIndex: 2,
        position:'absolute',
    },
    buttonEtapa1: {
        backgroundColor: '#FF3D00',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '185%',
        alignSelf: 'center',
        zIndex: 2,
        position:'absolute',
    },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonFinalizar: {
        backgroundColor: '#005C59',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'170%',
        alignSelf: 'center',
        zIndex: 2,
    },
    buttontextFinalizar: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    ApresentaApp: {
        fontSize: 32,
        fontWeight: 'bold',
        width: '100%',
        height: '20%',
        top: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 5 },
        textShadowRadius: 7,
        textAlign: 'center',
        color: "white",
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: '18%',
        paddingStart: '5%',
        paddingEnd: '5%',
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    campoEndereco: {
        height: 50,
        marginBottom: 10,
        marginTop: 10,
        marginLeft:10,
        fontSize: 20,
        backgroundColor:'#EDEDED',
        borderRadius:5,
        opacity: 1,
        color:'#00413E',
        width:'100%',
        justifyContent:'center',
        alignSelf:'center',
        zIndex:5,
        textAlign:'center',
        
        
    },
    campoSenha: {
        paddingLeft: 0,
        height: 30,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        marginTop: 10,
        opacity: 1,
        color:'#00413E',
    },
    campoBairro: {
        paddingLeft: 0,
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        width: '100%',
        opacity: 1,
        color:'#00413E',
    },
    campoNumeroCasa: {
        marginLeft: 0,
        color:'#00413E',
    },
    containerCidadeEstado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    campoCidadeEstado: {
        marginLeft: 0,
        width: '48%',
        color:'#00413E',
    },
});
