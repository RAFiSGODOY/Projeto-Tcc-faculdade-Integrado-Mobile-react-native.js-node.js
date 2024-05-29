import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Contratos from '../pages/Contratos';
import Configuracoes from '../pages/Configuracoes';
import { Feather } from '@expo/vector-icons';
import Procurar from '../pages/Procurar'

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: '#ffff',
                    borderTopWidth: 0,
                    width:'100%',
                    margin:0,
                },
                tabBarActiveBackgroundColor: '#008D86',
                tabBarActiveTintColor: '#ffff',
                tabBarInactiveTintColor: '#005C58',
                tabBarLabelStyle:{
                    fontSize:10,
                    width:'100%',
                }
            }}
        > 
        <Tab.Screen
                name="Procurar"
                component={Procurar}
                options={{
                    tabBarIcon: ({ color}) => (
                        <Feather name="search" size={22} color={color} />
                    ),
                    tabBarLabel: 'Procurar',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            />
        <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color}) => (
                        <Feather name="home" size={22} color={color} />
                    ),
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            />
            
            <Tab.Screen
                name="Contratos"
                component={Contratos}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Feather name="briefcase" size={22} color={color} />
                    ),
                    tabBarLabel: 'Contratos',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            />
             <Tab.Screen
                name="Configurações"
                component={Configuracoes}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Feather name="settings" size={22} color={color} />
                    ),
                    tabBarLabel: 'Configurações',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            />
           
        </Tab.Navigator>
    );
}
