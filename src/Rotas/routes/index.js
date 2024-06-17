import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../../pages/Welcome/index';
import SignIn from '../../pages/SignIn/index';
import Cadastro from '../../pages/Cadastro/index';
import RecuperarSenha from '../../pages/RecuperarSenha/index';
import { AuthContext } from '../../Auth/authContext/AuthContext';
import LoadingScreen from '../../components/Loading';
import MainNavigator from '../MainNavigator/index';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken ? 'MainNavigator' : 'Welcome'}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenha}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

