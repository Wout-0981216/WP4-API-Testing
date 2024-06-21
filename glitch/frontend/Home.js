import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { AuthContext } from './AuthProvider';
import Layout from './Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { LinearProgress } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { authenticated, loading, logout } = authContext;
  const [message, setMessage] = useState('');
  const [courseNames, setCourseNames] = useState([]);
  const [courseDescriptions, setCourseDescriptions] = useState([]);
  const [courseIDs, setCourseIds] = useState([]);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState([]);
  const [teacher, setTeacher] = useState('');

  const fetchData = async () => {
    try {
      if (authenticated) {
        setMessage('Welkom bij de glitch startpagina!');
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://192.168.56.1:8000/game/HomeCourses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setTeacher(data.teacher);

        setCourseNames(data.courses?.map(course => course.naam) || []);
        setCourseDescriptions(data.courses?.map(course => course.beschrijving) || []);
        setCourseIds(data.courses?.map(course => course.course_id) || []);
        setProgress(data.courses?.map(course => course.voortgang) || []);
        setUserName(data.name ?? '');

      }
    } catch (error) {
      console.log('Error fetching data:', error);
      logout();
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, logout, navigation, teacher]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.orangeblock}>
        <Text style={styles.header}>Welkom {userName}!</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.coursesContainer}>
        {Array.isArray(courseNames) && courseNames.map((courseName, index) => (
          <View
            key={index}
            style={[
              styles.courseBlock,
              index % 2 === 0 ? styles.leftAlign : styles.rightAlign
            ]}
          >
            <View style={styles.courseHeader}>
              {index % 2 === 0 ? (
                <>
                  <View style={styles.iconWrapper}>
                    <Icon name="school" size={50} color="white" />
                  </View>
                  <Text style={styles.courseTitleLeft}>{courseName}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.courseTitleRight}>{courseName}</Text>
                  <View style={styles.iconWrapper}>
                    <Icon name="school" size={50} color="white" />
                  </View>
                </>
              )}
            </View>
            <Text>Beschrijving cursus: {courseDescriptions[index]}</Text>
            <Text>Voortgang:</Text>
            <LinearProgress style={styles.progressBar} value={progress[index]/45} />
            <Button
            onPress={() => {
                navigation.navigate("Course", { 
                    screen: "Course", 
                    course_id: courseIDs[index], 
                    styles: styles 
                });
                console.log(courseIDs[index]);
            }}
            title={"Bekijk cursus"}
        />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 75,
  },
  orangeblock: {
    backgroundColor: '#CA591A',
    padding: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
  coursesContainer: {
    width: '100%',
    padding: 10,
  },
  courseBlock: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitleLeft: {
    textAlign: 'left',
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseTitleRight: {
    textAlign: 'right',
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 10,
    height: 10,
  },
  progressBarSmall: {
    marginTop: 10,
    height: 10,
    width: 200,
  },
  iconWrapper: {
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    padding: 10,
    margin: 20,
  },
  greyblock: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgrey',
    boxSizing: 'border-box',
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
  rightAlign: {
    alignSelf: 'flex-end',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 16,
    color: 'white',
  },
  backButtonSize: {
    width: 200,
  },
  '@media (maxWidth: 600px)': {
    coursesContainer: {
      flexDirection: 'column',
    },
    courseBlock: {
      alignSelf: 'center',
    },
    greyblock: {
      marginTop: 20,
      marginBottom: 20,
      height: 100,
    },
  },
});

export default HomePage;