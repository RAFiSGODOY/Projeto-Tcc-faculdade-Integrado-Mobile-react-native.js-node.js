import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/Auth/authContext/AuthContext'; 
import Routes from './src/Rotas/routes/index';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#47C2B6" barStyle="light-content"/>
      <Routes />
    </AuthProvider>
  );
}
