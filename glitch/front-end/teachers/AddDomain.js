import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthProvider';
import LayoutTeacher from './LayoutTeacher';

const AddDomain = () => {
  const [domain_name, setDomain_name] = useState('');
  const [domain_desc, setDomain_desc] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { setAuthenticated } = useContext(AuthContext);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const domain = { 
        domain_name, 
        domain_desc
      };
      const response = await axiosInstance.post('/teachers/register_domain/', domain);

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        setAuthenticated(true);
        setMessage('Domein toegevoegd!')
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Er is een fout opgetreden bij het opslaan van het domein');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <LayoutTeacher>
      <View style={{width: 200}}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
      <Input
        label="Domein naam"
        onChangeText={setDomain_name}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Typ hier de domeinnaam"
      />
      <Input
        label="Domein beschrijving"
        onChangeText={setDomain_desc}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Typ hier de domeinbeschrijving"
      />
      <Button
        title="Voeg domein toe"
        onPress={handleSubmit}
        buttonStyle={styles.button_orange}
        titleStyle={{ fontSize: 30 }}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null }
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </LayoutTeacher>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E8',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  message: {
    color: 'green',
    marginTop: 10,
  },
  button_orange: {
    backgroundColor: '#CA591A',
    marginTop: 10,
    width: '100%',
  },
  notificationContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default AddDomain;
