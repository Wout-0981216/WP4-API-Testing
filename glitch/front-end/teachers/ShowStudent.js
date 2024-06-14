import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Button} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { Input, Icon, Card } from '@rneui/themed';
import Layout from '../Layout';
import { LinearProgress } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowStudent = ({ route, navigation}) => {
  const { module_id, styles } = route.params;
  const [course_id, setCourse_id] = useState('');
  const [module_name, setModule_name] = useState('');
  const [module_info, setModule_info] = useState({});
  const [activities, setActivities] = useState({});
  const [points_challenge, setPoints_challenge] = useState({});
  const [context_challenge, setContext_challenge] = useState({});
  const [core_assignment, setCore_assignment] = useState({});
  const isFocused = useIsFocused();

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
            setCourse_id(data.course_id);
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
  },[module_id, isFocused]);

  function Activities() {
    const activities_array = [];
    for (let i = 1; i <= module_info.nr_of_activities; i++) {
      const activitynr = "activity" + i;
      activities_array.push(
        <View key={i} style={{flexDirection: 'row'}}>
          <Text style={{ fontWeight: 'bold'}}>{`\n  -${activities[activitynr]["activity_name"]}   -  voortgang: ${activities[activitynr]["progress"]}/${activities[activitynr]["max_progress"]}  `}
            <Button onPress={() => navigation.navigate("ActivitiesModule", {screen: "ActivitiesModule",activity_id: activities[activitynr]["activity_id"],styles: styles})} title='naar activiteit'/>
          </Text>
        </View>
      );
    }
    return activities_array;
  }
  
  

  return(
    <View>
      <View style={styles.backButtonSize}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
      <View style={styles.coursesContainer}>
        <View style={styles.courseBlock}>
          <View style={styles.courseHeader}>
          <Text style={styles.courseTitleLeft}>{module_name}</Text>
          </View>
          <Text>Beschrijving module: {module_info.module_desc}</Text>
          <Text>{`\nActiviteiten:`}</Text>
          <Activities/>
          <View style={{flexDirection: 'row'}}>
            <Text>{`\nPoints Challenge behaalde punten: `}
              <Text style={{ fontWeight: 'bold'}}>{`${points_challenge.points_challenge_progress}/${points_challenge.points_challenge_points}  `}</Text>
              <LinearProgress value={(points_challenge["points_challenge_progress"]/points_challenge["points_challenge_points"])} style={styles.progressBarSmall}/>
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>{`\nContext Challenge: `}
              <Text style={{ fontWeight: 'bold'}}> {context_challenge.challenge_name} </Text>
                <Button onPress={() => navigation.navigate("ConceptAssignment", {screen: "ConceptAssignment", concept_id: context_challenge.challenge_id, styles: styles})} title='naar Context Challenge'/>
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text >{`\nCore Assignment: `}
              <Text style={{ fontWeight: 'bold'}}> {core_assignment.challenge_name} </Text>
              <Button onPress={() => navigation.navigate("CoreAssignment", {screen: "CoreAssignment", module_id: module_id, styles: styles})} title='naar Core Assignment'/>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ModulePage;