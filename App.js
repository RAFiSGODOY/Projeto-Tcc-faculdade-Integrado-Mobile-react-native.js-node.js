import { StatusBar } from 'react-native';
import React  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import TabRoutes from './src/TabRoutes';


export default function App() {
  return(
    <NavigationContainer>
      <StatusBar backgroundColor="#008D86" barStyle="light-content"/>
      <TabRoutes/>  
    </NavigationContainer>
  );
}





