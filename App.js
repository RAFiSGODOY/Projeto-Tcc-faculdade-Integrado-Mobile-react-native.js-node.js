import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/Auth/authContext/AuthContext'; 
import Routes from './src/Rotas/routes/index';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
      <StatusBar backgroundColor="#47C2B6" barStyle="light-content"/>
      <Routes />
      </ApplicationProvider>
    </AuthProvider>
  );
}
