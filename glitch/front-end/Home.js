import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Grid, Typography, LinearProgress } from '@mui/material';
import { AuthContext } from './AuthProvider';
import Layout from './Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SchoolIcon from '@mui/icons-material/School';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation()
  const authContext = useContext(AuthContext);
  const { authenticated, loading, logout } = authContext;
  const [message, setMessage] = useState('');
  const [courseNames, setCourseNames] = useState([]);
  const [courseDescriptions, setCourseDescriptions] = useState([]);
  const [courseIDs, setCourseIds] = useState([]);
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authenticated) {
          setMessage('Welkom bij de glitch startpagina!');
          const token = await AsyncStorage.getItem('access_token');
          const response = await fetch('http://127.0.0.1:8000/game/HomeCourses', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCourseNames(data.courses.map(course => course.naam) || []);
          setCourseDescriptions(data.courses.map(course => course.beschrijving) || []);
          setCourseIds(data.courses.map(course => course.course_id) || []);
          setProgress(data.courses.map(course => course.voortgang) || []);
          setUserName(data.name || '');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
        logout();
        
      }
    };
  
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, logout]);

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
    <Layout>
      <View style={styles.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <View style={styles.orangeblock}>
              <Typography variant="h1">Welkom {userName}!</Typography>
              <Typography>{message}</Typography>
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
                          <SchoolIcon style={styles.icon} />
                        </View>
                        <Typography variant="h4" style={styles.courseTitleLeft}>{courseName}</Typography>
                      </>
                    ) : (
                      <>
                         <Typography variant="h4" style={styles.courseTitleRight}>{courseName}</Typography>
                        <View style={styles.iconWrapper}>
                          <SchoolIcon style={styles.icon} />
                        </View>
                      </>
                    )}
                  </View>
                  <Typography> Beschrijving cursus: {courseDescriptions[index]}</Typography>
                  <Typography>Voortgang:</Typography>
                  <LinearProgress style={styles.progressBar} variant="determinate" value={progress[index]} />
                  <Button onPress={() => navigation.navigate("Module", { screen: "Module", course_id: courseIDs[index], styles: styles })} title={"Bekijk cursus"} />

                </View>
              ))}
            </View>
          </Grid>
          <Grid item xs={12} sm={4}>
            <View style={styles.greyblock}>
              <Typography variant="h3">Deadlines</Typography>
              <Typography>Hier komen de aankomende deadlines...</Typography>
              <Typography>Hier komen de aankomende deadlines...</Typography>
              <Typography>Hier komen de aankomende deadlines...</Typography>
              <Typography>Hier komen de aankomende deadlines...</Typography>
            </View>
          </Grid>
        </Grid>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 75,
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
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: 10,
    width: 50,
    height: 50,
    color: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  courseTitleLeft: {
    textAlign: 'left',
    flex: 1,
  },
  courseTitleRight: {
    textAlign: 'right',
    flex: 1,
  },
  progressBar: {
    marginTop: 10,
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
    height: '100%',
    border: '5px solid lightgrey',
    boxSizing: 'border-box',
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
  rightAlign: {
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  '@media (max-width: 600px)': {
    coursesContainer: {
      flexDirection: 'column',
    },
    courseBlock: {
      alignSelf: 'center',
    },
    greyblock: {
      marginTop: 20,
      marginBottom: 20,
      height: 100
    },
  FlatList: {
    flexWrap: 'wrap'
  }},
});

export default HomePage;
