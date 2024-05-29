import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import SearchContrato from '../../assets/SearchContrato.jpg';
import Onibus from '../../assets/back-home.jpg';
import { Dimensions } from 'react-native';

export default function Home() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [rotaInicio, setRotaInicio] = useState('');
    const [rotaFim, setRotaFim] = useState('');
    const [servicosEncontrados, setServicosEncontrados] = useState([]);
    const [mensagem, setMensagem] = useState('Serviços Encontrados:');
    const [contratos, setContratos] = useState([]);
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

                    const contratosResponse = await api.get('/contrato', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (contratosResponse.data.length > 0) {
                        setContratos(contratosResponse.data);
                        setMensagem('');
                    } else {
                        setContratos([]);
                        setMensagem('Nenhum Serviço Encontrado');
                    }
                }
            } catch (error) {
            }
        };

        fetchUserData();
    }, []);
    
    const buscarServicosOferta = async () => {
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
                setMensagem('');
            } else {
                setServicosEncontrados([]);
                setMensagem('Nenhum Serviço Encontrado:');
            }
        } catch (error) {
            console.log('Erro ao buscar serviços de oferta:', error);
            setServicosEncontrados([]);
            setMensagem('Erro ao buscar serviços...');
        }
    };

    useEffect(() => {
        if (rotaInicio !== '' && rotaFim !== '') {
            buscarServicosOferta();
        }
    }, [rotaInicio, rotaFim]);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.containerForm}>
             {contratos.length > 0 ? (
                    
                    <View>
                        <Text style={styles.infoHeaderText}>Contratos Encontrados:</Text>
                        {contratos.map((contrato, index) => (
                            <View key={index}>
                                <Text>Contrato: {contrato.nome}</Text>
                                <Text>Rota Início: {contrato.rota_inicio}</Text>
                                <Text>Rota Fim: {contrato.rota_fim}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View>
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoHeaderText}>Procure sua empresa :</Text> 
                        </View>
                        <View>
                        <Text style={styles.infoText}>Informe seu Endereço de Partida:</Text>
                        <TextInput
                        placeholder="Endereço de Partida"
                        keyboardType="adress"
                        style={styles.inputEndereço}
                        onChangeText={(text) => setRotaInicio(text)}
                        />
                        <Text style={styles.infoDica}>Dica: Este será o endereço de sua residência ou local de onde deseja embarcar quando escolher um contrato de transporte.</Text>
                        <Text style={styles.infoText}>Informe seu Endereço de Chegada:</Text>
                        <TextInput
                        placeholder="Endereço de Chegada"
                        keyboardType="adress"
                        style={styles.inputEndereço}
                        onChangeText={(text) => setRotaFim(text)}
                        />
                        <Text style={styles.infoDica}>Dica: Este será o endereço do seu destino final (Universidade, Faculdade, Colégio etc...)</Text>
                        </View>
                        
                        {mensagem ? (
                <View>
                    <View style={styles.infoHeader}>

                            <Text style={styles.infoHeaderText}>{mensagem}</Text>
                            <Text></Text>
                        </View>
                    <Image
                                source={SearchContrato}
                                style={{ height: "65%", 
                                width: "100%",  
                                alignSelf: "center", 
                                marginBottom:'0%',
                             }}
                            />
                </View>
                ) : (
                <View>
                    {servicosEncontrados.map((servico, index) => (
                        <Text key={index} style={styles.servicoText}>{servico.nome}</Text>
                    ))}
                </View>
                   )}
           
             </View>
           )}
        </View> 
            
            
       </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
        backgroundColor: 'white',
    },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#005C58',
        width: '90%',
        borderRadius: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        alignSelf: 'center',
        zIndex: 2,
    },
    containerpesquisa: {
        backgroundColor: '#ffff',
        borderRadius:10,
        zIndex:5,
        width:'90%',
        alignSelf:'center',
        height:'40%',
        marginTop:'50%',
        position:'absolute',

    },
    inputEndereço:{
        paddingLeft: 0,
        alignSelf:'center',
        textAlign:'center',
        height: 50,
        marginTop: 40,
        fontSize: 12,
        width:'90%',
        borderRadius:10,
        color:'#00413E',
        backgroundColor: 'rgba(0, 92, 88, 0.07)',
        borderColor: '#005C58',
    },
    inputEndereço1:{
        paddingLeft: 0,
        alignSelf:'center',
        textAlign:'center',
        height: 50,
        marginTop: 20,
        fontSize: 12,
        borderRadius:10,
        width:'90%',
        color:'#00413E',
        backgroundColor: 'rgba(0, 92, 88, 0.07)',
        borderColor: '#005C58',
    },
    
    TextHeader: {
        fontSize: 22,
        width: '100%',
        height: 'auto',
        fontWeight: '900',
        marginTop: '5%',
        alignSelf: 'center',
        textAlign: 'center',
        position:'absolute',
        color: "#ffff",
        zIndex: 1,
    },
});
