import { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../../components/Loading';


export default function NCasa() {
  const [modalColor, setModalColor] = useState('#FF0000'); 
  const [showModal, setShowModal] = useState(false);
  const [errorTotais, setErrorTotais] = useState('');
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [userChanged, setUserChanged] = useState(false);


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
    setUserChanged(newUser !== user);
  }, [newUser, user]);

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
                setUser(userData.n_casa);
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

const onSubmit = async () => {
    setIsLoading(true);
        try {
            console.log('Dados validados:', { newUser });
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Token não fornecido');
            }

            const response = await api.patch('/client', {
                n_casa: newUser,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Resposta da API:', response.data);
            showAndHideSuccess('Número da Residência Alterado com Sucesso!');
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
        <Feather name={'map-pin'} size={22} color="#005C58" style={styles.PinEmail}/>
        <TextInput
          placeholder={user}
          keyboardType="email-address"
          style={styles.inputEmail}
          onChangeText={(text) => setNewUser(text)}
        /> 
       
        </View>    
        <Text style={styles.text2}>Número da sua residência (Casa), sempre atualize este campo caso troque de endereço.</Text>
     
        <TouchableOpacity
          style={[
            styles.button,
            (!newUser || !userChanged) && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={!newUser || !userChanged}
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
    width:'110%',
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
    paddingLeft:5,
    fontSize: 16,
    marginTop:20,
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

