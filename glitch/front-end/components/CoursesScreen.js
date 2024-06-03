import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

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
      // Haal het authenticatietoken op uit de lokale opslag (bijv. AsyncStorage)
      const token = await AsyncStorage.getItem('access_token');

      const response = await axios.get(`http://127.0.0.1:8000/teachers/api/students/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const students = response.data;
      navigation.navigate('Students', { courseId, students });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchStudentsForCourse(item.id)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
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
});

export default CoursesScreen;
