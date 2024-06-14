import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon, LinearProgress } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import LayoutTeacher from './LayoutTeacher';
import Notification from '../PushNotification';

const HomePageTeacher = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { authenticated, loading, logout } = authContext;
  const [message, setMessage] = useState('');
  const [domainNames, setDomainNames] = useState([]);
  const [domainDescriptions, setDomainDescriptions] = useState([]);
  const [domainIDs, setDomainIds] = useState([]);
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
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
          setDomainNames(data.domains.map(domain => domain.naam) || []);
          setDomainDescriptions(data.domains.map(domain => domain.beschrijving) || []);
          setDomainIds(data.domains.map(domain => domain.id) || []);
          const courses_list = [];
          for(const domain in data.domains){
            const course_list = [[],[],[]];
            for(const course_data in data.domains[domain].courses_data){
              course = data.domains[domain].courses_data[course_data];
              course_list[0].push(course.naam);
              course_list[1].push(course.beschrijving);
              course_list[2].push(course.course_id);
            };
            courses_list.push(course_list);
          };
          setCoursesInfo(courses_list);
          setUserName(data.name || '');
          setShowNotification(true);
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

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

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
    <LayoutTeacher>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.orangeblock}>
          <Text style={styles.header}>Welkom leraar {userName}!</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={styles.addCourseButton}>
          <Button onPress={() => navigation.navigate('AddDomain')} title={"Nieuw domein toevoegen"}/>
        </View>
        {Array.isArray(domainNames) && domainNames.map((domainName, domain_index) => (
          <View 
            key={domain_index}
            style={styles.domainsContainer}>
            <Text style={styles.courseTitleLeft}>Domein: {domainName}
              <View  style={styles.addCourseButton}>
                <Button onPress={() => navigation.navigate('AddCourse', {domain_id: domainIDs[domain_index]})} title={"Nieuwe cursus toevoegen"}/>
              </View>
            </Text>
            <Text>Beschrijving Domein: {domainDescriptions[domain_index]}</Text>

            <View style={styles.coursesContainer}>
              {Array.isArray(coursesInfo[domain_index][0]) && coursesInfo[domain_index][0].map((courseName, index) => (
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
                          <Icon name="school" size={20} color="white" />
                        </View>
                        <Text style={styles.courseTitleLeft}>{courseName}</Text>
                        <Button onPress={() => navigation.navigate("TeacherModule", { screen: "TeacherModule", course_id: coursesInfo[domain_index][2][index], styles: styles })} title={"Bekijk cursus"}/>
                      </>
                    ) : (
                      <>
                        <Button onPress={() => navigation.navigate("TeacherModule", { screen: "TeacherModule", course_id: coursesInfo[domain_index][2][index], styles: styles })} title={"Bekijk cursus"}/>
                        <Text style={styles.courseTitleRight}>{courseName}</Text>
                        <View style={styles.iconWrapper}>
                          <Icon name="school" size={20} color="white" />
                        </View>
                      </>
                    )}
                  </View>
                  <Text>Beschrijving cursus: {coursesInfo[domain_index][1][index]}</Text>
                </View>
              ))}
            </View>

          </View>
        ))}
        <View style={styles.notificationContainer}>
        {/* showNotification && (
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseNotification}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        ) */ }
        {/* showNotification && (
          <Notification
            message="Cursussen geladen!"
            visible={showNotification}
            onClose={handleCloseNotification}
          />
        )*/}
      </View>
      </ScrollView>
   </LayoutTeacher>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 75,
  },
  notificationContainer: {
    position: 'absolute',
    width: '40%',
  },
  closeButton: {
    position: 'relative',
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
  },
  addCourseButton: {
    padding: 10, 
  },
  orangeblock: {
    backgroundColor: '#CA591A',
    padding: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
  domainsContainer: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'pink'
  },
  coursesContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'grey',
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
    padding: 10,
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
  FlatList: {
    flexWrap: 'wrap',
  },
});

export default HomePageTeacher;
