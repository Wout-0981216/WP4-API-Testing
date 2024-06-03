import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CoursesScreen = () => {
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/teachers/api/courses/', {
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
      const response = await axios.get(`http://127.0.0.1:8000/teachers/api/students/${courseId}`, {
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
                <View>
                  <Text style={styles.subtitle}>Studenten:</Text>
                  {Array.isArray(expandedCourses[item.id]) && expandedCourses[item.id].length > 0 ? (
                    expandedCourses[item.id].map(student => (
                      <Text key={student.id} style={styles.student}>
                        {student.first_name}
                        {student.last_name}
                        {student.email}
                      </Text>
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
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  student: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default CoursesScreen;
