import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ModulePageTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const navigation = useNavigation();

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
      <View style={{width: 200}}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
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
                    <Text style={styles.tableHeaderCell}>Acties</Text>
                  </View>
                  {Array.isArray(expandedCourses[item.id]) && expandedCourses[item.id].length > 0 ? (
                    expandedCourses[item.id].map(student => (
                      <View key={student.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{student.first_name}</Text>
                        <Text style={styles.tableCell}>{student.last_name}</Text>
                        <Text style={styles.tableCell}>{student.email}</Text>
                        <View style={styles.actionsContainer}>
                          <TouchableOpacity
                            onPress={() => navigation.navigate('InspectStudent', { student_id: student.id })}
                          >
                            <Text style={styles.linkText}>Opdrachten in afwachting</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.progressButton}
                            onPress={() => navigation.navigate('ShowStudent', { student_id: student.id, course_id: item.id })}
                          >
                            <Text style={styles.buttonText}>Bekijk voortgang</Text>
                          </TouchableOpacity>
                        </View>
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
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  progressButton: {
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ModulePageTeacher;