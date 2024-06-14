import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthProvider';
import LayoutTeacher from './LayoutTeacher';
import Notification from '../PushNotification';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const AddModuleTeacher = () => {
  const [module_name, setModule_name] = useState('');
  const [module_des, setModule_des] = useState('');
  const [main_assignment_title, setMain_assignment_title] = useState('');
  const [main_assignment_des, setMain_assignment_des] = useState('');
  const [activity1_title, setActivity1_title] = useState('');
  const [activity2_title, setActivity2_title] = useState('');
  const [activity3_title, setActivity3_title] = useState('');
  const [activity1_des, setActivity1_des] = useState('');
  const [activity2_des, setActivity2_des] = useState('');
  const [activity3_des, setActivity3_des] = useState('');
  const [concept_title, setConcept_title] = useState('');
  const [concept_des, setConcept_des] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { setAuthenticated } = useContext(AuthContext);

  // Haal de course_id op uit de route parameters
  const { course_id } = route.params;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const module = { 
        module_name, 
        module_des, 
        main_assignment_title, 
        main_assignment_des, 
        activity1_title, 
        activity2_title, 
        activity3_title, 
        activity1_des, 
        activity2_des, 
        activity3_des, 
        concept_title, 
        concept_des, 
        course_id 
      };
      const response = await axiosInstance.post('/teachers/register_module/', module);

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        setAuthenticated(true);
        setShowNotification(true); // Toon de notificatie na het succesvol toevoegen van de module
        setTimeout(() => setShowNotification(false), 3000); // Verberg de notificatie na 3 seconden
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Er is een fout opgetreden bij het opslaan van module');
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
            label="Module naam"
            onChangeText={setModule_name}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de modulenaam"
          />
          <Input
            label="Module beschrijving"
            onChangeText={setModule_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de modulebeschrijving"
          />
          <Input
            label="Hoofd opdracht titel"
            onChangeText={setMain_assignment_title}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de titel van de hoofdopdracht"
          />
          <Input
            label="Hoofd opdracht beschrijving"
            onChangeText={setMain_assignment_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van de hoofdopdracht"
          />
          <Input
            label="Concept opdracht titel"
            onChangeText={setConcept_title}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van de conceptopdracht"
          />
          <Input
            label="Concept opdracht beschrijving"
            onChangeText={setConcept_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van de conceptopdracht"
          />
          <Input
            label="Titel activiteit 1 *"
            onChangeText={setActivity1_title}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de titel van activiteit 1"
          />
          <Input
            label="Beschrijving activiteit 1 *"
            onChangeText={setActivity1_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van activiteit 1"
          />
          <Input
            label="Titel activiteit 2"
            onChangeText={setActivity2_title}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de titel van activiteit 2"
          />
          <Input
            label="Beschrijving activiteit 2"
            onChangeText={setActivity2_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van activiteit 2"
          />
          <Input
            label="Titel activiteit 3"
            onChangeText={setActivity3_title}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de titel van activiteit 3"
          />
          <Input
            label="Beschrijving activiteit 3"
            onChangeText={setActivity3_des}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ hier de beschrijving van activiteit 3"
          />
          <Button
            title="Voeg module toe"
            onPress={handleSubmit}
            buttonStyle={styles.button_orange}
            titleStyle={{ fontSize: 30 }}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
    </LayoutTeacher>
  );
};

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

export default AddModuleTeacher;
