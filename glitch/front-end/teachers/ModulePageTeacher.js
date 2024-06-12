import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable} from 'react-native';
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
      activities_array.push(
        <Text key={i}>{module.module["activities"][activitynr]}</Text>
      );
    }
    return activities_array;
  }

  function ModuleCards() {
    const module_array = [];
    const cardGap = 16;
    const cardWidth = (window.innerWidth - cardGap * 3) / 2;
    for (let i = 1; i <= nr_of_modules; i++) {
      const modulenr = "module" + i;
      if (moduledict[modulenr]) { // Check if module data exists
        module_array.push(
          {key:
            <Card style={{
              marginTop: cardGap,
              marginLeft: i % 2 !== 0 ? cardGap : 0,
              width: cardWidth,
              height: 180,
              backgroundColor: 'white',
              borderRadius: 16,
              shadowOpacity: 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={styles.courseTitleLeft}>{moduledict[modulenr]["module_name"]}</Text>
              <Activities module={moduledict[modulenr]}/>
              <Text>Points Challenge  benodigde punten: {moduledict[modulenr]["points_challenge"]["points_challenge_points"]}</Text>
              {/* <LinearProgress variant="determinate" value={(moduledict[modulenr]["points_challenge"]["points_challenge_progress"]/moduledict[modulenr]["points_challenge"]["points_challenge_points"])*100} style={styles.progressBar} /> */}
              <Text>{moduledict[modulenr]["context_challenge_name"]}</Text>
              <Text>{moduledict[modulenr]["core_assignment_name"]}</Text>
            </Card>, id: moduledict[modulenr]["module_id"]});
      }
    }
    return (
      <View>
        <ScrollView>
        <Button
        onPress={() => navigation.navigate('AddModuleTeacher', { course_id })}
        title={"Voeg module toe"}
      />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {module_array.map((module, i) => {
              return (
                <View key={module.id}>
                  <Pressable onPress={() => navigation.navigate("Module", {screen: "Module", module_id: module.id, styles: styles})}>
                    {module.key}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
  

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{course_name} Modules</Text>
      <ModuleCards />
    </View>
  );
};

export default ModulePageTeacher;
