import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Dimensions} from 'react-native';
import { Input, Icon, Button, Card } from '@rneui/themed';
import { FlatGrid } from 'react-native-super-grid';
import Layout from '../Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModulePage from '../components/ModulePage';

const ModulePageTeacher = ({ route, navigation }) => {
  const { course_id, styles } = route.params;
  const [course_name, setCourse_name] = useState('');
  const [moduledict, setModule_dict] = useState({});
  const [nr_of_modules, setNr_of_modules] = useState('');

  useEffect(() => {
    const get_course_module_info = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch(`http://192.168.56.1:8000/game/api/modules/${course_id}/`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            const data = await response.json();
            setCourse_name(data.course_name);
            setNr_of_modules(data.nr_of_modules);
            setModule_dict(data.module_list);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
      }
    };
    get_course_module_info();
  }, [course_id]); // Voeg course_id toe aan de dependency array

  function Activities(module) {
    const activities_array = [];
    for (let i = 1; i <= module.module["nr_of_activities"]; i++) {
      const activitynr = "activity" + i;
      const activity = module.module["activities"][activitynr];
      activities_array.push(
        <View key={i} style={{justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{ fontWeight: 'bold' }}>Activiteit</Text>
          <Text >{activity.activity_name}</Text>
          {/* <Text>{`Voortgang: ${activity.progress}/${activity.max_progress}`}</Text> */}
          {/* <Button
            onPress={() => navigation.navigate("ActivitiesModule", { screen: "ActivitiesModule", activity_id: activity.activity_id, styles: styles })}
            title='Naar activiteit'
          /> */}
        </View>
      );
    }
    return activities_array;
  }
  

  function ModuleCards() {
    const module_array = [];
    for (let i = 1; i <= nr_of_modules; i++) {
      const modulenr = "module" + i;
      if (moduledict[modulenr]) { // Check if module data exists
        module_array.push(
            <View key={moduledict[modulenr]["module_id"]}
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              margin: 20,
              shadowOpacity: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={styles.courseTitleLeft}>{moduledict[modulenr]["module_name"]}</Text>
              <Activities module={moduledict[modulenr]}/>
              <Text style={{ fontWeight: 'bold' }}>Points Challenge </Text>  
              <Text >benodigde punten: {moduledict[modulenr]["points_challenge"]["points_challenge_points"]}</Text>
              {/* <LinearProgress variant="determinate" value={(moduledict[modulenr]["points_challenge"]["points_challenge_progress"]/moduledict[modulenr]["points_challenge"]["points_challenge_points"])*100} style={styles.progressBar} /> */}
              <Text style={{ fontWeight: 'bold' }}>Concept challange:</Text>
              <Text>{moduledict[modulenr]["context_challenge_name"]}</Text>
              <Text style={{ fontWeight: 'bold' }}>Core assigment:</Text>
              <Text>{moduledict[modulenr]["core_assignment_name"]}</Text>
            </View>
          );
      }
    }
    return (
      <ScrollView style={{height: (Dimensions.get('window').height)*0.70}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {module_array.map((module) => {
            return (
              <View key={module.key} style={{flex: 1, minWidth: 250, maxWidth: 400}}>
                {/* <Pressable onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module.id, styles: styles})}> */}
                  {module}
                {/* // </Pressable> */}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
  

  return (
    <View>
      <View style={styles.backButtonSize}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{`${course_name} Modules  \n`}
        <Button onPress={() => navigation.navigate('AddModuleTeacher', { course_id })} title={"Voeg module toe"}/>
      </Text>
      <ModuleCards />
    </View>
  );
};

export default ModulePageTeacher;
