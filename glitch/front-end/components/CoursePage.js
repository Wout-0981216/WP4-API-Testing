import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Button, Dimensions} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearProgress } from '@rneui/themed';

const CoursePage = ({ route, navigation }) => {
  const { course_id, styles } = route.params;
  const [course_name, setCourse_name] = useState('');
  const [moduledict, setModule_dict] = useState({});
  const [nr_of_modules, setNr_of_modules] = useState('');
  const isFocused = useIsFocused();

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
  }, [course_id, isFocused]); 

  function Activities(module) {
    const activities_array = [];
    for (let i = 1; i <= module.module["nr_of_activities"]; i++) {
      const activitynr = "activity" + i;
      activities_array.push(
        <Text key={i}>{module.module["activities"][activitynr]["activity_name"]}    {module.module["activities"][activitynr]["progress"]}/{module.module["activities"][activitynr]["max_progress"]}</Text>
      );
    }
    return activities_array;
  }

  function ModuleCards() {
    const module_array = [];
    for (let i = 1; i <= nr_of_modules; i++) {
      const modulenr = "module" + i;
      if (moduledict[modulenr]) { 
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
            <Text>Points Challenge    {moduledict[modulenr]["points_challenge"]["points_challenge_progress"]}/{moduledict[modulenr]["points_challenge"]["points_challenge_points"]}</Text>
            <LinearProgress value={(moduledict[modulenr]["points_challenge"]["points_challenge_progress"]/moduledict[modulenr]["points_challenge"]["points_challenge_points"])} style={styles.progressBar} />
            <Text>{moduledict[modulenr]["context_challenge_name"]}</Text>
            <Text>{moduledict[modulenr]["core_assignment_name"]}</Text>
            <Button onPress={() => navigation.navigate("Module", {screen: "Module", module_id: moduledict[modulenr]["module_id"], styles: styles})} title='Module bekijken' />
          </View>
        );
      }
    }
    return (
      <ScrollView style={{height: (Dimensions.get('window').height)*0.70}}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {module_array.map((module) => {
            return (
              <Pressable key={module.key} onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module.key, styles: styles})} style={{flex: 1, minWidth: 250, maxWidth: 400}}>
                {module}
              </Pressable>
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
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{course_name} Modules</Text>
      <ModuleCards />
    </View>
  );
};

export default CoursePage;