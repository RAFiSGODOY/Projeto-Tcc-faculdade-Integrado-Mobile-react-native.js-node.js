import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView, Container, TouchableOpacity, ScrollView, FlatList, StatusBar, Modal, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import SearchContrato from '../../assets/SearchContrato.jpg';
import Onibus from '../../assets/back-home.jpg';
import { Dimensions } from 'react-native';

export default function Procurar() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [rotaInicio, setRotaInicio] = useState('');
    const [rotaFim, setRotaFim] = useState('');
    const [servicosEncontrados, setServicosEncontrados] = useState([]);
    const [mensagem, setMensagem] = useState('Serviços Encontrados:');
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [height, setHeight] = useState('');

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
        setIsLoading(true);
        console.log(rotaFim, rotaInicio);
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
                setIsLoading(false);
            } else {
                setServicosEncontrados([]);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Erro ao buscar serviços de oferta:', error);
            setIsLoading(false);
            setServicosEncontrados([]);
        }
    };
    const openModal = (servico) => {
        setSelectedServico(servico);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedServico(null);
    };

    const acceptService = () => {
        console.log('Serviço aceito:', selectedServico);
        closeModal();
    };

    useEffect(() => {
        if (rotaInicio !== '' && rotaFim !== '') {
            buscarServicosOferta();
        }
    }, [rotaInicio, rotaFim]);
            

    return (
        <SafeAreaView style={styles.container}> 
        <StatusBar translucent backgroundColor="transparent" />
        <Image
                        source={Onibus}
                        style={{ height: "35%", 
                        width: "100%",  
                        alignSelf: "center", 
                        position:'absolute',
                     }}
                     resizeMode='cover'
                    />
        <View style={styles.containerForm}>
                    <View>
                        <View style={styles.infoHeader}>
                            <Text style={styles.TextHeader}>Procurar um Serviço</Text> 
                        </View>
                        <View>
                        <View style={styles.InputContainer}>
                        <Feather name="map-pin" size={22} color={'#E9ED19'} style={styles.Pin} />
                        <TextInput
                        placeholder="Cidade de Destino"
                        placeholderTextColor="#ffff"
                        keyboardType="adress"
                        style={styles.inputEndereço}
                        onChangeText={(text) => setRotaFim(text)}
                        
                        />
                        </View>
                        <Text style={styles.infoDica}>Dica: Informe a Cidade no qual deseja embarcar no transporte com destino a sua Instituição de Ensino.</Text>
                        <View style={styles.InputContainer2} >
                        <Feather name="map-pin" size={22} color={'#42E619'} style={styles.Pin} />
                        <TextInput
                        placeholder="Cidade de Partida"
                        placeholderTextColor="#ffff"
                        keyboardType="adress"
                        style={styles.inputEndereço1}
                        onChangeText={(text) => setRotaInicio(text)}
                        />
                        </View>
                        <Text style={styles.infoDica2}>Dica: Informe a Cidade onde sua Instituição de Ensino é localizada.</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={buscarServicosOferta} >
                        <Text style={styles.buttontext}>{isLoading ? 'Buscando Serviços...' : 'Procurar Serviço'}</Text>
                        </TouchableOpacity>
                        
                      
                <View>
                    <View style={styles.infoHeader}>
                            <Text style={styles.TextHeader2}>{mensagem}</Text>
                            <Text></Text>
                        </View>
                            {servicosEncontrados.length > 0 ? (
                         <ScrollView style={styles.servicosContainer}>
                         {servicosEncontrados.map((servico, index) => (
                                <TouchableOpacity key={index} style={styles.servicoItem} onPress={() => openModal(servico)}>
                                    <View style={styles.containerbranco}>
                                            <Text style={styles.servicoEmpresa}>{servico.nomeEmpresa}</Text> 
                                            <Text style={styles.servicoPreco}>{servico.preco}</Text>
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
                                        
                                    </View>
                                </TouchableOpacity>
                         ))}
                     </ScrollView>
                    ) : (
                        <Image
                        source={SearchContrato}
                        style={{ height: "60%", 
                        width: "90%",  
                        alignSelf: "center", 
                         marginTop:'55%',
                     }}
                     resizeMode='contain'
                    />
                    )}

                </View>
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {selectedServico && (
                                <>
                                    <Text style={styles.modalTitle}>Detalhes do Serviço</Text>
                                    <Text style={styles.modalText}>Empresa: {selectedServico.nomeEmpresa}</Text>
                                    <Text style={styles.modalText}>Rota Início: {selectedServico.rota_inicio}</Text>
                                    <Text style={styles.modalText}>Rota Fim: {selectedServico.rota_fim}</Text>
                                    <Text style={styles.modalText}>Preço: {selectedServico.preco}</Text>
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                                            <Text style={styles.modalButtonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.modalButton} onPress={acceptService}>
                                            <Text style={styles.modalButtonText}>Aceitar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                
           
             </View>
        </View> 
            
            
            
            
       </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffff',
    },
    containerbranco:{
     backgroundColor:'white',
     width:'100%',
     borderRadius:2,
     height:'100%',
     
    },

    rtF:{
        flexDirection: 'row',
        width:'45%',
        marginTop:0,
       // backgroundColor:'green',
        marginLeft:'55%',
        position:'absolute',
        borderBottomLeftRadius:5,
        borderTopLeftRadius:5,
        backgroundColor:'#005C58',
        
    },
    rtI:{
        flexDirection: 'row',
        width:'45%',
        borderBottomRightRadius:5,
        borderTopRightRadius:5,
        backgroundColor:'#005C58',
       // backgroundColor:'green',
    },
    Rotas:{
        flexDirection:'row',
        //backgroundColor:'gray',
        height:'auto',
        marginTop:35,
        width:'100%',
        position:'absolute',
    },
    servicoRotaInicio:{
        width:'85.5%',
        height:'100%',
        fontSize:12,
        color:'white',
        paddingTop:2,
        //backgroundColor:'pink',
        textAlign:'center',
    },
    servicoRotaFim:{
        width:'85.5%',
        height:'100%',
        fontSize:12,
        color:'white',
        paddingTop:2,
        textAlign:'center',
        justifyContent:'center',
       // backgroundColor:'pink',
    },

    servicoPreco:{
        paddingTop:40,
    },
    servicoEmpresa: {
    borderBottomWidth:0.5,
    color:'#005C58',
    textAlign:'center',
    fontSize:16,
    fontWeight:'900',
    borderColor:'#005C58',
    
    },

    servicoItem:{
     width:'100%',
     height:'25%',
     paddingLeft:10,
     paddingRight:10,
     backgroundColor:'#005C58',
     paddingBottom:2,
     paddingTop:2,
     marginBottom:10,

    },

    containerForm: {
      marginTop:40,
    },

    InputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 92, 88, 0.67)',
        borderRadius: 10,
        marginTop: '32%',
        width: '90%',
        position:'absolute',
        height:50,
        alignSelf: 'center',
    },
    InputContainer2:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 92, 88, 0.67)',
        borderRadius: 10,
        marginTop: 20,
        width: '90%',
        height:50,
        alignSelf: 'center',
    },

    Pin:{
     paddingLeft:10,
     paddingRight:10,
    },
    Pin2:{
    alignSelf:'center'
    },
    Pin4:{
     alignSelf:'center',
     marginLeft:2,
    },
    Pin3:{
    alignSelf:'center',
    //backgroundColor:'pink',
    marginLeft:14,
    },
    username:{
    color: '#005C58',
    marginLeft:10,
    marginTop:10,
    },
    infoDica:{
        color: '#ffff',
        marginLeft:22,
        fontSize:10,
        height:'50%',
        width:'80%',
        borderRadius:7,
        paddingLeft:5,
        paddingBottom:5,
        paddingTop:5,
        marginTop:'18.3%',
        position:'absolute',
        backgroundColor: 'rgba(0,  141, 134, 0.17)',
    },
    infoDica2:{
        color: '#ffff',
        marginLeft:22,
        fontSize:10,
        width:'80%',
        position:'absolute',
        marginTop:'45%',
        borderRadius:7,
        paddingLeft:5,
        paddingBottom:5,
        paddingTop:5,
        backgroundColor: 'rgba(0,  141, 134, 0.17)',
    },
    button: {
        backgroundColor: 'rgba(0,  141, 134, 0.87)',
        width: '90%',
        borderRadius:10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop:'62%',
        zIndex: 2,
        position:'absolute',
        
    },
    buttontext: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
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
        fontSize: 16,
        width:'85%',
        borderRadius:10,
        color:'#ffff',
        backgroundColor: 'transparent',
        borderColor: '#005C58',
    },
    inputEndereço1:{
        paddingLeft: 0,
        alignSelf:'center',
        textAlign:'center',
        height: 50,
        fontSize: 16,
        borderRadius:10,
        width:'85%',
        color:'#ffff',
        backgroundColor: 'transparent',
        borderColor: '#005C58',
    },
    
    TextHeader: {
        fontSize: 24,
        width: '94%',
        height: 'auto',
        fontWeight: '900',
        alignSelf: 'center',
        textAlign: 'center',
        //marginRight:10,
        color: "#ffff",
        zIndex: 1,
        //borderBottomWidth:0.5,
       // borderColor: '#005C58',
    },
    TextHeader2: {
        fontSize: 16,
        width: '100%',
        height: 'auto',
        fontWeight: '400',
        alignSelf: 'center',
        position:'relative',
        textAlign: 'center',
        marginRight:0,
        paddingBottom:5,
        paddingTop:5,
        marginTop:'60%',
        color: "#ffff",
        backgroundColor:'#005C58',
        zIndex: 1,
        borderBottomWidth:0.5,
        borderColor: '#005C58',
    },
   
});
