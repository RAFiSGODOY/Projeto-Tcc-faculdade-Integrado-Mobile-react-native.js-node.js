import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from '../../Rotas/TabRoutes/index';
import Configuracoes from '../../pages/Configuracoes/index';
import Nome from '../../pages/Atualizar/Nome/index';
import Email from '../../pages/Atualizar/EMAIL/index';
import Telefone from '../../pages/Atualizar/Telefone/index';
import NCasa from '../../pages/Atualizar/NCasa/index';
import Logradouro from '../../pages/Atualizar/Logradouro/index';
import DataNascimento from '../../pages/Atualizar/DataNascimento/index';
import Cidade from '../../pages/Atualizar/Cidade/index';
import Bairro from '../../pages/Atualizar/Bairro/index';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
    return (
     
        <Stack.Navigator initialRouteName="HomeTabs">
            <Stack.Screen
                name="HomeTabs"
                component={TabRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Configuracoes"
                component={Configuracoes}
                options={{ 
                    title: 'Configurações',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Nome"
                component={Nome}
                options={{ 
                    title: 'Nome de Usuário',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Telefone"
                component={Telefone}
                options={{ 
                    title: 'Telefone',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="NCasa"
                component={NCasa}
                options={{ 
                    title: 'Nº Casa',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Logradouro"
                component={Logradouro}
                options={{ 
                    title: 'Logradouro',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Email"
                component={Email}
                options={{ 
                    title: 'E-mail',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="DataNascimento"
                component={DataNascimento}
                options={{ 
                    title: 'Data de Nascimento',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Cidade"
                component={Cidade}
                options={{ 
                    title: 'Cidade',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            <Stack.Screen
                name="Bairro"
                component={Bairro}
                options={{ 
                    title: 'Bairro',
                    headerTitleStyle: {
                        fontWeight: 'bold', 
                    },
                    headerTintColor: '#fff', 
                    headerStyle: {
                        backgroundColor: '#008D86', 
                    },
                }}
            />
            
        </Stack.Navigator>
       
    );
}
