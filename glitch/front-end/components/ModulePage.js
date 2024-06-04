import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable} from 'react-native';
import { Input, Icon, Button, Card } from '@rneui/themed';
import { Grid, Typography, LinearProgress } from '@mui/material';
import Layout from '../Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Module_page = ({route, navigation}) => {
  const {module_id, styles} = route.params;
  const [module_info, setModule_info] = useState({});

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
            setModule_info(data.module_list);
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    get_module_info();
  }, [module_id]);

  function Activities(module) {
    const activities_array = [];
    for (let i = 1; i <= module.module["nr_of_activities"]; i++) {
      const activitynr = "activity" + i;
      activities_array.push(
        <Text key={i}>{module.module["activities"][activitynr]["activity_name"]}</Text>
      );
    }
    return activities_array;
  }
  return(
    <Layout> {console.log(module_info)}
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{module_info["module_name"]}</Text>
        <Activities module={module_info}/>
        <Text>Points Challenge benodigde punten: {module_info["points_challenge"]["points_challenge_points"]}</Text>
        <LinearProgress variant="determinate" value={(module_info["points_challenge"]["points_challenge_progress"]/module_info["points_challenge"]["points_challenge_points"])*100} style={styles.progressBar} />
        <Text>{module_info["context_challenge"]["challenge_name"]}</Text>
        <Text>{module_info["core_assignment"]["challenge_name"]}</Text>
    </Layout>
  );
};

export default Module_page;