import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegistrationForm from './Registration';
import Assignment from './assignment';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/concept-opdracht" element={<Assignment />} />
      </Routes>
  </BrowserRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
