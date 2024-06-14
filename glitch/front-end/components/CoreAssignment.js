import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button } from 'react-native';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../AuthProvider';

const CoreAssignment = ({ route, navigation }) => {
    const { module_id } = route.params;
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authenticated } = useContext(AuthContext);
  
    useEffect(() => {
      if (authenticated) {
        fetchCoreAssignment();
      }
    }, [authenticated]);
  
    const fetchCoreAssignment = async () => {
      try {
        const response = await axiosInstance.get(`game/api/core-assignment/${module_id}`);
        const coreAssignment = response.data.core_assignment;
        setAssignment(coreAssignment);
      } catch (error) {
        setError('Er is een fout opgetreden bij het ophalen van de hoofdopdrachten.');
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
    <View>
        <View style={styles.backButtonSize}>
          <Button onPress={() => navigation.goBack()} title='Terug'/>
        </View>
        <View style={styles.coursesContainer}>
            <View style={styles.courseBlock}>
                <Text style={styles.title}>{assignment.naam}</Text>
                <Text style={styles.description}>{assignment.beschrijving}</Text>
            </View>
      </View>
    </View>
    );
};

const styles = StyleSheet.create({
    assignmentContainer: {
      padding: 20,
      marginVertical: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      width: '90%',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 16,
      marginTop: 10,
    },
  });
  
  export default CoreAssignment;
