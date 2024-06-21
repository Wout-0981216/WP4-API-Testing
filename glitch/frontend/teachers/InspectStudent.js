import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LayoutTeacher from './LayoutTeacher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const InspectStudent = ({ route }) => {
  const { student_id } = route.params;
  const [voortgangData, setVoortgangData] = useState({
    hoofd_opdrachten_voortgang: [],
    concept_opdrachten_voortgang: [],
  });

  const navigation = useNavigation();

  useEffect(() => {
    fetchProgressData();
  }, [student_id]);

  const fetchProgressData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`http://192.168.56.1:8000/teachers/api/students_open/${student_id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setVoortgangData(data);
    } catch (error) {
      console.error('Error fetching progress data', error);
    }
  };

  const approveAssignment = async (assignmentId, assignmentType) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://192.168.56.1:8000/teachers/api/approve_assignment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment_id: assignmentId,
          assignment_type: assignmentType,
        }),
      });
      const data = await response.json();
      console.log(data);
      fetchProgressData();
    } catch (error) {
      console.error('Error approving assignment', error);
    }
  };

  const rejectAssignment = async (assignmentId, assignmentType) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://192.168.56.1:8000/teachers/api/reject_assignment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment_id: assignmentId,
          assignment_type: assignmentType,
        }),
      });
      const data = await response.json();
      console.log(data);
      fetchProgressData(); 
    } catch (error) {
      console.error('Error rejecting assignment', error);
    }
  };

  return (
    <LayoutTeacher>
      <View style={{width: 200}}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
      <View>
        <Text style={styles.text1}>Openstaande opdrachten</Text>
        <View style={styles.showProfile}>
          {voortgangData.hoofd_opdrachten_voortgang.length > 0 && (
            <>
              <Text style={styles.text}>Hoofdopdrachten:</Text>
              {voortgangData.hoofd_opdrachten_voortgang.map((item, index) => (
                <View key={index}>
                  <Text style={styles.text}>
                    {item.hoofd_opdracht__naam}: {item.hoofd_opdracht__beschrijving}
                  </Text>
                  <Button
                    title="Keur goed"
                    onPress={() => approveAssignment(item.id, 'hoofd_opdracht')}
                  />
                  <Button
                    title="Keur af"
                    onPress={() => rejectAssignment(item.id, 'hoofd_opdracht')}
                  />
                </View>
              ))}
            </>
          )}
          {voortgangData.concept_opdrachten_voortgang.length > 0 && (
            <>
              <Text style={styles.text}>Conceptopdrachten:</Text>
              {voortgangData.concept_opdrachten_voortgang.map((item, index) => (
                <View key={index}>
                  <Text style={styles.text}>
                    {item.concept_opdracht__naam}: {item.concept_opdracht__beschrijving}
                  </Text>
                  <Button
                    title="Keur goed"
                    onPress={() => approveAssignment(item.id, 'concept_opdracht')}
                  />
                  <Button
                    title="Keur af"
                    onPress={() => rejectAssignment(item.id, 'concept_opdracht')}
                  />
                </View>
              ))}
            </>
          )}
          {(voortgangData.hoofd_opdrachten_voortgang.length === 0 &&
            voortgangData.concept_opdrachten_voortgang.length === 0) && (
              <Text style={styles.text}>Geen openstaande opdrachten gevonden</Text>
            )}
        </View>
      </View>
    </LayoutTeacher>
  );
};

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

export default InspectStudent;
