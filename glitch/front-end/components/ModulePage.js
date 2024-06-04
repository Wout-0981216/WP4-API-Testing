import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable} from 'react-native';
import { Input, Icon, Button, Card } from '@rneui/themed';
import { Grid, Typography, LinearProgress } from '@mui/material';
import Layout from '../Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModulePage = ({ route, navigation }) => {
  const { module_id, styles } = route.params;
  const [module_name, setModule_name] = useState('');
  const [module_info, setModule_info] = useState({});
  const [activities, setActivities] = useState({});
  const [points_challenge, setPoints_challenge] = useState({});
  const [context_challenge, setContext_challenge] = useState({});
  const [core_assignment, setCore_assignment] = useState({});

  useEffect(() => {
    const get_module_info = async () => {
      try{
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch(`http://192.168.56.1:8000/game/api/module/${module_id}/`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            setModule_name(data.module_name);
            setModule_info(data.module_info);
            setActivities(data.activities);
            setPoints_challenge(data.points_challenge);
            setContext_challenge(data.context_challenge);
            setCore_assignment(data.core_assignment);
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    get_module_info();
  },[]);

  function Activities() {
    const activities_array = [];
    for (let i = 1; i <= module_info.nr_of_activities; i++) {
      const activitynr = "activity" + i;
      activities_array.push(
        <Pressable onPress={() => navigation.navigate("ActivitiesModule", {screen: "ActivitiesModule", activity_id: activities[activitynr]["activity_id"], styles: styles})} key={i}>
          <Text style={{ fontWeight: 'bold'}}> {activities[activitynr]["activity_name"]} </Text>
        </Pressable>
      );
    }
    return activities_array;
  }

  return(
    <View>
      <View style={styles.coursesContainer}>
        <View style={styles.courseBlock}>
          <View style={styles.courseHeader}>
          <Text style={styles.courseTitleLeft}>{module_name}</Text>
          </View>
          <Text>Beschrijving module: {module_info.module_desc}</Text>
          <Text>Activiteiten:</Text>
          <Activities/>
          <Text>Points Challenge benodigede punten: {points_challenge.points_challenge_points}</Text>
          <LinearProgress variant="determinate" value={(points_challenge["points_challenge_progress"]/points_challenge["points_challenge_points"])*100} style={styles.progressBar}/>
          <Text>Context Challenge: 
            <Pressable onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module.id, styles: styles})}> 
              <Text style={{ fontWeight: 'bold'}}> {context_challenge.challenge_name} </Text>
            </Pressable>
          </Text>
          <Text>Core Assignment: 
            <Pressable onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module.id, styles: styles})}>
              <Text style={{ fontWeight: 'bold'}}> {core_assignment.challenge_name} </Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ModulePage;