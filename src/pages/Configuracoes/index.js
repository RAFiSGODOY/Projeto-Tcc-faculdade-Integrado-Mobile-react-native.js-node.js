import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import Miguel from '../../assets/Miguel.png';

export default function Configurações() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
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
    const [modalColor, setModalColor] = useState('#FF0000');
  
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
                    setUserName(userResponse.data.nome);
                }
            } catch (error) {
            }
        };

        fetchUserData();
    }, []);
    

    return (
         <View style={styles.containerForm}>
                <StatusBar translucent backgroundColor="transparent" />
                    <View>
    
              
           
             </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    containerForm: {
        backgroundColor: '#ffff',
        width: "100%",
        height: "100%",
        position: "absolute",
    },
});
