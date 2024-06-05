import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';
import WelcomeIMG from '../../assets/WelcomeIMG.png';
import api from '../services/api';
import { StatusBar } from 'react-native';

export default function Cadastro() {
    const navigation = useNavigation();
    const [etapa, setEtapa] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfirmado, setConfirmarpassword] = useState('');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cep, setCep] = useState('');
    const [numeroCasa, setNumeroCasa] = useState('');
    const [bairro, setBairro] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [telefone, setTelefone] = useState('');
    const [errorTotais, setErrorTotais] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [camposObrigatorios, setCamposObrigatorios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [modalColor, setModalColor] = useState('#FF0000');
    const [adress, setAdress] = useState({
        cep: '',
        logradouro: '',
        localidade: '',
        bairro: '',
        uf: ''
    });

    const getAdressFromApi = useCallback(() => {
        fetch(`https://viacep.com.br/ws/${adress.cep}/json/`)
            .then(res => res.json())
            .then((data) => {
                setAdress(prevState => ({
                    ...prevState,
                    bairro: data.bairro || prevState.bairro,
                    localidade: data.localidade || prevState.localidade,
                    logradouro: data.logradouro || prevState.logradouro,
                    uf: data.uf || prevState.uf
                }));
                setCep(data.cep);
                setBairro(data.bairro);
                setCidade(data.localidade);
                setEstado(data.uf);
                setLogradouro(data.logradouro);
                setNumeroCasa(data.numeroCasa);
            })
            .catch(err => console.log('erro: ', err))
    }, [adress.cep]);

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
    const clearFieldError = (field) => {
        setFieldErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
        });
    
        setCamposObrigatorios((prevCampos) => prevCampos.filter(campo => campo !== field));
    };
    const verificarCamposObrigatorios = useCallback(() => {
        let camposFaltando = [];
        let errors = {};
        if (etapa === 1) {
            if (!email) {
                camposFaltando.push('email');
                errors.email = 'Preencha seu E-mail!';
            }
            if (!nome){
                camposFaltando.push('nome');
                errors.nome = 'Preencha seu Nome!';
            }
            if (!cpf) {
                camposFaltando.push('cpf');
                errors.cpf = 'Preencha seu CPF!';

            }
            if (!dataNascimento){
                camposFaltando.push('dataNascimento');
                errors.dataNascimento = 'Preencha sua data de nascimento!';
            }
        }else if (etapa === 2) { 
            if (!cep){
                camposFaltando.push('cep');
                errors.cep = 'Informe seu Cep!';
            } 
            if (!numeroCasa){
                camposFaltando.push('numeroCasa');
                errors.numeroCasa = 'Informe sua Residência!';
            }
                
            if (!adress.bairro){
                camposFaltando.push('bairro');
                errors.bairro = 'Informe seu bairro!';
            } 
            if (!estado){
                camposFaltando.push('estado');
                errors.estado = 'Informe seu Estado';
            } 
            if (!adress.logradouro){
                camposFaltando.push('logradouro');
                errors.logradouro = 'Informe seu logradouro( Sua rua )!';
            } 
             if (!cidade){
                camposFaltando.push('cidade');
                errors.cidade= 'Informe sua Cidade!';
            } 
            
        } else if (etapa === 3) {
            if (!password){
                camposFaltando.push('password');
                errors.password = 'Informe sua senha!';
            } 
            if (!passwordconfirmado){
                camposFaltando.push('passwordconfirmado');
                errors.passwordconfirmado = 'Confirme sua Senha!';
            } 
            if (!telefone){
                camposFaltando.push('telefone');
                errors.telefone = 'Informe seu telefone!';
            } 
        } 

        setCamposObrigatorios(camposFaltando);
        setFieldErrors(errors);

        return camposFaltando.length === 0;
    }, [etapa, email,password,passwordconfirmado,cidade,telefone,adress.logradouro, cep, cpf, nome,dataNascimento,numeroCasa,estado,adress.bairro ]);

    useEffect(() => {
        if (etapa === 2 && adress.cep) {
            getAdressFromApi();
        }
    }, [etapa, adress.cep, getAdressFromApi]);

    const proximaEtapa = () => {
        if (verificarCamposObrigatorios()) {
            if (etapa === 1) {
                if (validateCPF(cpf)) {
                    if (validarDtNascimento(dataNascimento)) {
                        showAndHideCorreto('Sucesso!');
                        setTimeout(() => {
                            setShowModal(false);
                            setErrorTotais('');
                            setEtapa(2);
                        }, 1500);
                        console.log(email, nome, cpf, dataNascimento);
                    } else {
                        showAndHideError('Data de Nascimento inválida!');
                    }
                } else {
                    showAndHideError('CPF inválido!');
                }
            } else if (etapa === 2) {
                showAndHideCorreto('Sucesso!');
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    setEtapa(3);
                }, 1500);
                console.log(cep, numeroCasa, cidade, adress.bairro, estado, adress.logradouro);
            } else if (etapa === 3) {
                if (password !== passwordconfirmado) {
                    showAndHideError('As senhas precisam ser iguais!');
                } else {
                    cadastrarCliente();
                }
            }
        } else {
            showAndHideError('Preencha todos os campos obrigatórios');
        }
    };

    const validarDtNascimento = (dataNascimento) => {
        return parseInt(dataNascimento.substring(6)) > 1949;
    };

    const validateCPF = (strCPF) => {
        const cpf = strCPF.replace(/\D/g, '');

        if (cpf.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit1 = sum % 11;
        digit1 = digit1 < 2 ? 0 : 11 - digit1;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digit2 = sum % 11;
        digit2 = digit2 < 2 ? 0 : 11 - digit2;

        if (parseInt(cpf.charAt(9)) !== digit1 || parseInt(cpf.charAt(10)) !== digit2) {
            return false;
        }

        return true;
    };

    const cadastrarCliente = async () => {
        try {
            const dataConvertida = moment(dataNascimento, 'DD/MM/YYYY').format("YYYY/MM/DD");
            const cleanedTelefone = telefone.replace(/[^\d]/g, '');
            setIsLoading(true); 
            const response = await api.post('/client', {
                email,
                password,
                nome,
                cpf,
                data_nascimento: dataConvertida,
                cep,
                n_casa: numeroCasa,
                bairro: adress.bairro,
                logradouro: adress.logradouro,
                municipio: cidade,
                telefone: cleanedTelefone
            });

            console.log('Cliente cadastrado com sucesso:', response.data);
            setIsLoading(false);
            showAndHideCorreto('Cadastrado com sucesso!');
            setTimeout(() => {
                setShowModal(false);
                setErrorTotais('');
                setTimeout(() => {
                    setShowModal(false);
                    setErrorTotais('');
                    navigation.navigate('SignIn');
                }, 1000);

            }, 1500);

        } catch (error) {
            showAndHideError('E-mail já utilizado!');
            setIsLoading(false);
            setTimeout(() => {
                setShowModal(false);
                setErrorTotais('');
                navigation.navigate('Welcome');
            }, 1000);
            

        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="rgba(0, 141, 134, 1)" barStyle="light-content"/>
            <Text style={styles.ApresentaApp}>Cadastro</Text>
            
            
            <Animatable.View animation="fadeInUp" delay={200} style={styles.containerForm}>
                {etapa === 1 && (
                    <Animatable.View >
                        <View style={styles.infoHeader}>
                            <View style={styles.line1} />
                            <Text style={styles.infoHeaderText}>INFORMAÇÕES PESSOAIS</Text>
                            <View style={styles.line2} />
                        </View>
                        <TextInput
                            placeholder="Nome"
                            onChangeText={(text) => {setNome(text); clearFieldError('nome');}}
                            style={[styles.campoNome, camposObrigatorios.includes('nome') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.nome && <Text style={styles.errorText}>{fieldErrors.nome}</Text>}
                        <TextInput
                            placeholder="E-mail"
                            onChangeText={(text) => {setEmail(text); clearFieldError('email');}}
                            keyboardType="email-address"
                            style={[styles.campoEmail, camposObrigatorios.includes('email') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
                        <TextInputMask
                            type={'cpf'}
                            options={{
                                maskType: 'BRL',
                                dddMask: '999.999.999-99',
                            }}
                            value={cpf}
                            onChangeText={(text) => {setCpf(text);clearFieldError('cpf');}}
                            keyboardType="numeric"
                            placeholder="CPF"
                            style={[styles.campoCPF, camposObrigatorios.includes('cpf') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.cpf && <Text style={styles.errorText}>{fieldErrors.cpf}</Text>}
                        <View style={styles.containerDataNascimento}>
                            <Text style={styles.datanascimentotext}>Data de Nascimento:</Text>
                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'DD/MM/YYYY',
                                }}
                                value={dataNascimento}
                                onChangeText={(text) => {setDataNascimento(text); clearFieldError('dataNascimento');}}
                                placeholder="DD/MM/YYYY"
                                style={[styles.campoDataNascimento, camposObrigatorios.includes('dataNascimento') && styles.campoObrigatorio]}
                            />
                           
                        </View> 
                        {fieldErrors.dataNascimento && <Text style={styles.errorText2}>{fieldErrors.dataNascimento}</Text>}
                        <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                            <Text style={styles.buttontext}>Próxima Etapa</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 2 && (
                    <Animatable.View animation="fadeInUp" delay={200}>
                        <View style={styles.infoHeader}>
                            <View style={styles.line1} />
                            <Text style={styles.infoHeaderText}>INFORMAÇÕES DO ENDEREÇO</Text>
                            <View style={styles.line2} />
                        </View>

                        <View style={styles.containerEndereco}>
                        <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '99999-999'
                                }}
                                value={adress.cep} 
                                onEndEditing={()=> getAdressFromApi()}
                                onChangeText={(text) => {clearFieldError('cep'); setAdress((oldAdress) =>({
                                    ...oldAdress,
                                 cep:text
                                 
                                }))}}
                                keyboardType="numeric"
                                placeholder="CEP"
                                style={[styles.campoEndereco, camposObrigatorios.includes('cep') && styles.campoObrigatorio]}
                               
                            />
                            {fieldErrors.cep && <Text style={styles.errorTextCep}>{fieldErrors.cep}</Text>}
                            <TextInput
                                placeholder="Nº Residência"
                                onChangeText={(text) =>{setNumeroCasa(text); clearFieldError('numeroCasa');} }
                                keyboardType="numeric"
                                style={[styles.campoEndereco, styles.campoNumeroCasa, camposObrigatorios.includes('numeroCasa') && styles.campoObrigatorio]}
                            />
                            {fieldErrors.numeroCasa && <Text style={styles.errorTextRes}>{fieldErrors.numeroCasa}</Text>}
                        </View>
                        
                        <View style={styles.containerCidadeEstado}>
                            <TextInput
                                placeholder="Cidade"
                                value={adress.localidade} 
                                onChangeText={(text) => {clearFieldError('cidade'); setAdress((oldAdress) =>({
                                    ...oldAdress,
                                 localidade:text
                                }))}}
                                style={[styles.campoEndereco, styles.campoCidadeEstado, camposObrigatorios.includes('cidade') && styles.campoObrigatorio]}
                            />
                            {fieldErrors.cidade && <Text style={styles.errorTextCid}>{fieldErrors.cidade}</Text>}
                            <TextInput
                                placeholder="Estado"
                                value={adress.uf} 
                                onChangeText={(text) => {clearFieldError('estado');setAdress((oldAdress)=>({
                                    ...oldAdress,
                                    uf:text
                                }))}}
                                style={[styles.campoEndereco, styles.campoCidadeEstado, camposObrigatorios.includes('estado') && styles.campoObrigatorio]}
                            />
                            {fieldErrors.estado && <Text style={styles.errorTextEst}>{fieldErrors.estado}</Text>}
                        </View>
                        <TextInput
                            placeholder="Bairro"
                            value={adress.bairro} 
                            onChangeText={(text) => {clearFieldError('bairro'); setAdress((oldAdress)=> ({
                                ...oldAdress,
                                bairro:text
                            }))}}
                            style={[styles.campoBairro, camposObrigatorios.includes('bairro') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.bairro && <Text style={styles.errorText}>{fieldErrors.bairro}</Text>}
                        <TextInput
                            placeholder="Logradouro"
                            value={adress.logradouro} 
                            onChangeText={(text) => {clearFieldError('logradouro');setAdress((oldAdress)=>({
                                ...oldAdress,
                                logradouro:text
                            }))}}
                            style={[styles.campoLogradouro, camposObrigatorios.includes('logradouro') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.logradouro && <Text style={styles.errorText}>{fieldErrors.logradouro}</Text>}
                        <TouchableOpacity style={styles.button} onPress={proximaEtapa}>
                            <Text style={styles.buttontext}>Próxima Etapa</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
                {etapa === 3 && (
                    <Animatable.View animation="fadeInUp" delay={200}>
                    <View style={styles.infoHeader}>
                            <View style={styles.line1} />
                            <Text style={styles.infoHeaderText}>INFORMAÇÕES FINAIS</Text>
                            <View style={styles.line2} />
                        </View>
                    <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '(99) 99999-9999'
                                }}
                                value={telefone}
                                onChangeText={(text) => {setTelefone(text);clearFieldError('telefone');}}
                                keyboardType="numeric"
                                placeholder="Telefone"
                                style={[styles.campoBairro, camposObrigatorios.includes('telefone') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.telefone && <Text style={styles.errorText}>{fieldErrors.telefone}</Text>}
                        <TextInput
                            placeholder="Senha"
                            onChangeText={(text) => {setPassword(text); clearFieldError('password');}}
                            secureTextEntry={true}
                            style={[styles.campoBairro, camposObrigatorios.includes('password') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
                        <TextInput
                            placeholder="Confirmar Senha"
                            onChangeText={(text) => {setConfirmarpassword(text); clearFieldError('passwordconfirmado');}}
                            secureTextEntry={true}
                            style={[styles.campoBairro, camposObrigatorios.includes('passwordconfirmado') && styles.campoObrigatorio]}
                        />
                        {fieldErrors.passwordconfirmado && <Text style={styles.errorText}>{fieldErrors.passwordconfirmado}</Text>}
                        <TouchableOpacity style={styles.buttonFinalizar} onPress={proximaEtapa}>
                        <Text style={styles.buttontext}>{isLoading ? 'Carregando...' : 'Finalizar Cadastro'}</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                )}
            </Animatable.View>
            
             <Modal visible={showModal} transparent >
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
    campoObrigatorio: {
        borderColor: 'red',
        borderBottomWidth: 0.5, 
    },
    container: {
        flex: 1,
        zIndex: 0,
        marginBottom:0,
        backgroundColor:"rgba(0, 141, 134, 1)",
    },
    errorText:{
        color:'red',
        fontWeight:'300',
        //borderTopWidth:0.5,
        //borderColor:'red',
        fontSize:12,
        marginTop:-10,
    },
    errorTextCep:{
        color:'red',
        fontWeight:'300',
        fontSize:12,
        marginTop:40,
        position:'absolute',
    },
    errorTextEst:{
        color:'red',
        fontWeight:'300',
        fontSize:12,
        marginTop:40,
        marginLeft:184,
        position:'absolute',
    },
    errorTextCid:{
        color:'red',
        fontWeight:'300',
        fontSize:12,
        marginTop:40,
        position:'absolute',
    },
    errorTextRes:{
        color:'red',
        fontWeight:'300',
        fontSize:12,
        marginTop:40,
        marginLeft:184,
        position:'absolute',
    },
    errorText2:{
        color:'red',
        fontWeight:'300',
        //borderTopWidth:0.5,
        //borderColor:'red',
        fontSize:12,
        marginLeft:141,
        marginTop:-10,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    line1: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#7C7C7C',
        marginRight: 5,
    },
    line2: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#7C7C7C',
        marginLeft: 5,
    },
    infoHeaderText: {
        fontSize: 18,
        color: '#4B4B4B',
        fontWeight: '600',
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
        color: '#4B4B4B',
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
        backgroundColor: 'rgba(0, 141, 134, 1)',
        width: '90%',
        borderRadius: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        alignSelf: 'center',
        zIndex: 2,
    },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonV: {
        backgroundColor: '#005C58',
        width: '90%',
        borderRadius: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
        zIndex: 2,
    },
    buttontextV: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonFinalizar: {
        backgroundColor: '#005C59',
        width: '80%',
        borderRadius: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
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
        width: '100%',
        height: '10%',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 5 },
        textShadowRadius: 7,
        marginTop: 5,
        alignSelf: 'center',
        textAlign:'center',
        color: "#ffff",
        zIndex: 4,
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
        marginTop: '15%',
        paddingStart: '5%',
        paddingEnd: '5%',
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    containerEndereco: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    campoEndereco: {
        paddingLeft: 0,
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
        borderColor: '#005C58',
        borderBottomWidth: 0.5,
        width: '48%',
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