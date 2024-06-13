import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button } from 'react-native';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../AuthProvider';

const CoreAssignment = ({ route }) => {
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
      <View style={styles.container}>
        <Button onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module_id, styles: styles})} title='Terug'/>
        <View style={styles.assignmentContainer}>
          <Text style={styles.title}>{assignment.naam}</Text>
          <Text style={styles.description}>{assignment.beschrijving}</Text>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E6E6E8',
    },
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
    error: {
      color: 'red',
      fontSize: 18,
      textAlign: 'center',
    },
  });
  
  export default CoreAssignment;
