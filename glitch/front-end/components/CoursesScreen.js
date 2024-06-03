import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/courses/')
      .then(response => setCourses(response.data))
      .catch(error => console.error(error));
  }, []);

  return (

  );
};



export default CoursesScreen;
