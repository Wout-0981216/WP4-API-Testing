import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LayoutTeacher from './LayoutTeacher';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InspectStudent = () => {
  const [voortgangData, setVoortgangData] = useState({
    hoofd_opdrachten_voortgang: [],
    concept_opdrachten_voortgang: [],
  });

  useEffect(() => {
    const getVoortgangData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://192.168.56.1:8000/teachers/api/students_open/2/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        setVoortgangData(data);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de voortgangsgegevens', error);
      }
    };
    getVoortgangData();
  }, []);

  return (
    <LayoutTeacher>
      <View>
        <Text style={styles.text1}>Openstaande opdrachten</Text>
        <View style={styles.showProfile}>
          {voortgangData.hoofd_opdrachten_voortgang.length > 0 && (
            <>
              <Text style={styles.text}>Hoofdopdrachten:</Text>
              {voortgangData.hoofd_opdrachten_voortgang.map((item, index) => (
                <Text key={index} style={styles.text}>{item.hoofd_opdracht__naam}: {item.hoofd_opdracht__beschrijving}</Text>
              ))}
            </>
          )}
          {voortgangData.concept_opdrachten_voortgang.length > 0 && (
            <>
              <Text style={styles.text}>Conceptopdrachten:</Text>
              {voortgangData.concept_opdrachten_voortgang.map((item, index) => (
                <Text key={index} style={styles.text}>{item.concept_opdracht__naam}: {item.concept_opdracht__beschrijving}</Text>
              ))}
            </>
          )}
          {(voortgangData.hoofd_opdrachten_voortgang.length === 0 && voortgangData.concept_opdrachten_voortgang.length === 0) && (
            <Text style={styles.text}>Geen openstaande opdrachten gevonden</Text>
          )}
        </View>
      </View>
    </LayoutTeacher>
  );
};

export default InspectStudent;

const styles = StyleSheet.create({
  text1: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    padding: 10,
  },
  showProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
