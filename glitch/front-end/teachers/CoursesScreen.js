import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ModulePage from '../components/ModulePage';

const ModulePageTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get('http://192.168.56.1:8000/teachers/api/courses/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentsForCourse = async (courseId) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(`http://192.168.56.1:8000/teachers/api/students/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setExpandedCourses(prevState => ({
        ...prevState,
        [courseId]: response.data
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCourse = (courseId) => {
    if (expandedCourses[courseId]) {
      setExpandedCourses(prevState => {
        const newState = { ...prevState };
        delete newState[courseId];
        return newState;
      });
    } else {
      fetchStudentsForCourse(courseId);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleCourse(item.id)}>
            <View style={styles.item}>  
              <Text style={styles.title}>Cursus: {item.naam}</Text>
              <Text>Beschrijving: {item.beschrijving}</Text>
              {expandedCourses[item.id] && (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Voornaam</Text>
                    <Text style={styles.tableHeaderCell}>Achternaam</Text>
                    <Text style={styles.tableHeaderCell}>Email</Text>
                  </View>
                  {Array.isArray(expandedCourses[item.id]) && expandedCourses[item.id].length > 0 ? (
                    expandedCourses[item.id].map(student => (
                      <View key={student.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{student.first_name}</Text>
                        <Text style={styles.tableCell}>{student.last_name}</Text>
                        <Text style={styles.tableCell}>{student.email}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.student}>Geen studenten gevonden</Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    item: {
      padding: 20,
      marginVertical: 8,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
    },
    title: {
      fontSize: 18,
    },
    table: {
      marginTop: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      paddingBottom: 5,
    },
    tableHeaderCell: {
      flex: 1,
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 5,
    },
    tableCell: {
      flex: 1,
    },
    student: {
      fontSize: 14,
      marginTop: 5,
    },
  });
  

export default ModulePageTeacher;
