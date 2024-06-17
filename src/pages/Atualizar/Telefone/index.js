import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { StatusBar } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../../components/Loading';


export default function Telefone() {
  const [modalColor, setModalColor] = useState('#FF0000'); 
  const [showModal, setShowModal] = useState(false);
  const [errorTotais, setErrorTotais] = useState('');
  const [userTell, setUserTell] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [newTell, setNewTell] = useState('');
  const [tellChanged, setTellChanged] = useState(false);
  const [placeholderTell, setPlaceholderTell] = useState(userTell);


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
  useEffect(() => {
    setTellChanged(newTell !== userTell);
  }, [newTell, userTell]);
  useEffect(() => {
    setPlaceholderTell(userTell);
  }, [userTell]);

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

                const userData = userResponse.data;
                setUserTell(userData.telefone);
                console.log("telefone",userTell)
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

    fetchUserData();
}, []);
function formatarTelefone(numero) {
  const numeroLimpo = String(numero ?? '').replace(/\D/g, ''); // Converte para string e remove não numéricos

  if (numeroLimpo.length === 11) {
    return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
  } else {
    return numeroLimpo; 
  }
}



const onSubmit = async () => {
  setIsLoading(true);
  try {
    console.log('Dados validados:', { newTell });
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Token não fornecido');
    }

    const numeroDesformatado = newTell.replace(/\D/g, ''); // Remove a formatação

    const response = await api.patch('/client', {
      telefone: numeroDesformatado, // Envia o número desformatado
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Resposta da API:', response.data);
    showAndHideSuccess('Telefone Alterado com Sucesso!');
    setIsLoading(false);
  } catch (error) {
    console.log('Erro ao alterar:', error.response ? error.response.data : error.message);
    showAndHideError('Erro ao alterar!');
    setIsLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0, 141, 134, 1)" barStyle="light-content"/>
      <Animatable.View animation="fadeInUp" delay={200} style={styles.containerform}>
        <View style={styles.InputEmailIcon}>
        <Feather name={'phone'} size={22} color="#005C58" style={styles.PinEmail}/>
        <TextInputMask
            type={'cel-phone'} 
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            value={formatarTelefone(newTell)} // Formata newTell antes de exibir
            onChangeText={(text) => setNewTell(text)}
            placeholder={formatarTelefone(userTell)} // Formata userTell para o placeholder
            style={styles.inputEmail} 
          />
       
        </View>   
        <Text style={styles.text2}>Número Pessoal, enviado a Empresa para que entre em contato com você.</Text>
        <TouchableOpacity
          style={[
            styles.button,
            (!newTell || !tellChanged) && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={!newTell || !tellChanged}
        >
          {isLoading ? <Loading /> : <Text style={styles.buttontext}>Alterar</Text>}
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
    backgroundColor: '#ffff',
  },
  button: {
    backgroundColor: 'rgba(0, 141, 134, 1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: '10%',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  buttonLoading: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: '10%',
  },
  buttontext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText1:{
    color:'red',
    fontWeight:'300',
    fontSize:12,
    marginTop:3,
    marginLeft:-10,
    marginBottom:1,
   
  },
   text2: {
    color:'#343434',
    textAlign:'left',
    fontSize:11,
    marginTop:'2%',
    marginLeft:-8,
    width:'100%',
    fontWeight:'400',
   },
  campoObrigatorio: {
    borderColor: 'red',
    borderBottomWidth: 0.5, 
    },
  containerform: {
    backgroundColor: 'white',
    paddingStart: '5%',
    paddingEnd: '5%',
    width:'100%',
    height:'100%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  inputEmail: {
    paddingLeft: 0,
    height: 40,
    fontSize: 16,
    marginTop:20,
    paddingLeft:5,
    color:'#00413E',
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderColor: '#005C58',
    borderBottomWidth: 0.5,
    width:'97%',
  },
  InputEmailIcon:{
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
    
  },
  PinEmail:{
   width:'7%',
   borderColor: '#005C58',
   borderBottomWidth: 0.5,
   paddingBottom:10,
   marginTop:27,
   marginLeft:-10,
   
   
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

});

