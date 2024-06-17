import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { StatusBar } from 'react-native';
import { AuthContext } from '../../Auth/authContext/AuthContext';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';


export default function Login() {
  const navigation = useNavigation();
  const [modalColor, setModalColor] = useState('#FF0000'); 
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorTotais, setErrorTotais] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [camposObrigatorios, setCamposObrigatorios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useContext(AuthContext);


  const showAndHideError = (message) => {
    setErrorTotais(message);
    setShowModal(true);
    setModalColor('#FF0000');
    setTimeout(() => {
      setShowModal(false);
      setErrorTotais('');
    }, 2000);
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

  const verificarCamposObrigatorios = useCallback(() => {
    let camposFaltando = [];
    let errors = {};
     if (!email) {
            camposFaltando.push('email');
            errors.email = 'Informe seu E-mail!';
         
        }
      if(!password){
        camposFaltando.push('password');
        errors.password = 'Informe sua senha!';
        
      }
    setCamposObrigatorios(camposFaltando);
    setFieldErrors(errors);

    return camposFaltando.length === 0;
}, [ email,password]);

const onSubmit = async (email, password) => {
  setIsLoading(true);
  if (verificarCamposObrigatorios()) {
    try {
      if (!email || !password) {
        showAndHideError('Por favor, preencha todos os campos.');
        setIsLoading(false);
        return;
      }
      const response = await api.post('/auth/client', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        login(response.data.token);
        showAndHideSuccess('Sucesso ao Entrar');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainNavigator' }],
          });
        }, 1500);
      } else {
        showAndHideError('Email ou senha incorretos, tente novamente.');
        setIsLoading(false);
      }
    } catch (error) {
      showAndHideError('E-mail ou senha incorretos!');
      setIsLoading(false);
    }
  } else {
    showAndHideError('Preencha todos os campos obrigatórios');
    setIsLoading(false);
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
    

  return (
    <View style={styles.container}>
      
      <StatusBar backgroundColor="rgba(0, 141, 134, 1)" barStyle="light-content"/>
      <Text style={styles.bemvindo}>Bem Vindo(a)</Text>
      <Animatable.View animation="fadeInUp" delay={200} style={styles.containerform}>
        <Text style={styles.logintext}>Login</Text>
        <Text style={styles.text2}>Digite seu e-mail:</Text>
        <View style={styles.InputEmailIcon}>
        <Feather name={'mail'} size={18} color="#005C58" style={styles.PinEmail}/>
        <TextInput
          placeholder="E-mail"
          keyboardType="email-address"
          style={[styles.inputEmail, camposObrigatorios.includes('email') && styles.campoObrigatorio]}
          onChangeText={(text) => {setEmail(text); clearFieldError('email');}}
        />
        </View>
        {fieldErrors.email && <Text style={styles.errorText1}>{fieldErrors.email}</Text>}
        
        <Text style={styles.text1}>Digite sua senha:</Text>
        <View style={styles.inputSENHA}>
        <Feather name={'key'} size={18} color="#005C58" style={styles.PinSenha}/>
          <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            style={[styles.inputSENHA, camposObrigatorios.includes('password') && styles.campoObrigatorio]}
            onChangeText={(text) => {setPassword(text);clearFieldError('password');}}
          />
          <TouchableOpacity
            style={styles.togglepassword}
            onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#4B4B4B" />
          </TouchableOpacity>
        </View>  
        {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
        
        <TouchableOpacity style={styles.button} onPress={() => onSubmit(email, password)}>
         {isLoading ? <Loading /> : <Text style={styles.buttontext}>Acessar</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCadrasto} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.cadastro}>Primeiro Acesso? Cadastrar-se</Text>
        </TouchableOpacity>
       <TouchableOpacity style={styles.buttonEsqueceuSenha} onPress={() => navigation.navigate('RecuperarSenha')}>
          <Text style={styles.Esenhatext}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 141, 134, 1)',
  },
  errorText1:{
    color:'red',
    fontWeight:'300',
    fontSize:12,
    marginTop:-25,
    marginBottom:20,
  },
  errorText:{
    color:'red',
    fontWeight:'300',
    fontSize:12,
    marginTop:0,
  },
  text1: {
    color:'#005C58',
    textAlign:'left',
    fontSize:12,
    marginTop:'0%',
    fontWeight:'400',
   },
   text2: {
    color:'#005C58',
    textAlign:'left',
    fontSize:12,
    marginLeft:20,
    marginTop:'38%',
    fontWeight:'400',
    position:'absolute',
   },
  campoObrigatorio: {
    borderColor: 'red',
    borderBottomWidth: 0.5, 
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
  containerform: {
    flex: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 30,
    paddingStart: '5%',
    paddingEnd: '5%',
    width:'100%',
    height:'100%',
    marginTop: '18%',
    position:'absolute',
  },
  buttonCadrasto: {
    justifyContent:'center',
    width: '100%',
    position:'absolute',
    marginTop:'115%',
    left:20,
  },
  cadastro: {
    color: '#343434', 
    textAlign:'center',
    position:'absolute',
    width:'100%',
  },
  togglepassword: {
    left: '90%',
    bottom:10,
    width:'10%',
    position:'absolute',
  },
  bemvindo: {
    fontSize: 32,
    width: '100%',
    height: '10%',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 5 },
    textShadowRadius: 7,
    marginTop: 10,
    alignSelf: 'center',
    textAlign:'center',
    color: "#ffff",
    zIndex: 1,
  },
  logintext: {
    position: 'absolute',
    fontSize: 24,
    width: '25%',
    textAlign:'center',
    fontWeight: '500',
    marginTop: 45,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 7,
    alignSelf: 'center',
    color: "#005C58",
    zIndex: 0,
  },
  containerHeader: {
    marginTop: '15%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  
  title: {
    fontSize: 20,
    marginTop: 30,
    color: '#00413E',
  },
 
  button: {
    backgroundColor: 'rgba(0, 141, 134, 1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 40,
  },
  buttonLoading: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 20,
  },
  buttontext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonEsqueceuSenha: {
    marginTop:70,
    marginBottom:0,
    width: '100%',
  },
  Esenhatext: {
    color: '#343434',
    fontSize: 12,
    textAlign:'center',
    textDecorationLine: "none",
  },
  inputEmail: {
    paddingLeft: 0,
    height: 40,
    marginBottom: 25,
    fontSize: 14,
    color:'#00413E',
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderColor: '#005C58',
    borderBottomWidth: 0.5,
    width:'90%',
    marginTop: 150,
  },
  InputEmailIcon:{
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
  },
  PinEmail:{
   marginTop:136,
   width:'7%',
   borderColor: '#005C58',
   borderBottomWidth: 0.5,
   paddingBottom:10,
   
  },
  PinSenha:{
    marginTop:13,
    width:'7%',
    borderColor: '#005C58',
    paddingBottom:10,
  },
  inputSENHA: {
    flexDirection:'row',
    paddingLeft: 0,
    height: 40,
    color:'#00413E',
    backgroundColor: 'transparent',
    marginTop: 0,
    fontSize: 14,
    width:'95%',
    borderRadius: 0,
    borderColor: '#005C58',
    borderBottomWidth: 0.5,
    
  },
  erroNome: {
    color: 'red',
    marginBottom: 20,
    marginTop: 130,
    fontWeight: '400',
    left: 20,
    position: 'absolute',
    borderColor: 'red',
    borderTopWidth: 0.5,
    width: '90%', 
  },
  erroSENHA: {
    color: 'red',
    fontWeight: '400',
    marginBottom: 20,
    marginTop: 193,
    left: 20,
    position: 'absolute',
    borderColor: 'red',
    borderTopWidth: 0.5,
    width: '90%', 
  },
  errorModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorModalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    alignItems: 'center',
    opacity:1,
  },
  errorModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#005C58',
  },
  errorModalButton: {
    backgroundColor: '#005C58',
    borderRadius: 10,
    padding: 10,
    width: '50%',
    alignItems: 'center',
  },
  errorModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

