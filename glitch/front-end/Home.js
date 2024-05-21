import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Grid, Typography, LinearProgress } from '@mui/material';
import { AuthContext } from './AuthProvider';
import Layout from './Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const { authenticated, loading, logout } = authContext;
  const [message, setMessage] = useState('');
  const [courseNames, setCourseNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authenticated) {
          setMessage('Welkom bij je startpagina!');
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
          setCourseNames(data.courses || []);
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
          <Grid item xs={8} sm={8}>
            <View style={styles.orangeblock}>
              <Typography variant="h1">Welkom Niels!</Typography>
              <Typography>{message}</Typography>
            </View>
            <View style={styles.coursesContainer}>
              {Array.isArray(courseNames) && courseNames.map((courseName, index) => (
                <View key={index} style={styles.courseBlock}>
                  <Typography variant="h4">{courseName}</Typography>
                  <LinearProgress variant="determinate" value={Math.random() * 100} style={styles.progressBar} />
                </View>
              ))}
            </View>
          </Grid>
          <Grid item xs={4} sm={4}>
            <View style={styles.greyblock}>
              <Typography variant="h6">Zijbalk</Typography>
              <Typography>Deadlines, vrienden & contact</Typography>
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
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  progressBar: {
    marginTop: 10,
  },
  greyblock: {
    backgroundColor: 'lightgrey',
    padding: 20,
    height: '100%',
  },
});

export default HomePage;
