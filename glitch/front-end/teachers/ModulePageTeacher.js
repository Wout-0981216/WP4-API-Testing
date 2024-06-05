import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Layout from '../Layout';

const ModulePageTeacher = ({ route, navigation }) => {
  const { course_id, styles } = route.params;
  const [course_name, setCourse_name] = useState('');
  const [moduledict, setModule_dict] = useState({});
  const [nr_of_modules, setNr_of_modules] = useState('');

  useEffect(() => {
    const get_module_info = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:8000/game/api/module/${course_id}/`, {
          method: 'GET',
        });
        const data = await response.json();
        setCourse_name(data.course_name);
        setNr_of_modules(data.nr_of_modules);
        setModule_dict(data.module_list);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
      }
    };
    get_module_info();
  }, [course_id]); // Voeg course_id toe aan de dependency array

  const Activities = ({ activities }) => {
    const activities_array = [];
    for (let i = 1; i <= nr_of_modules; i++) {
      const activitynr = "activity" + i;
      activities_array.push(
        <Text key={i}>{activities[activitynr]}</Text>
      );
    }
    return activities_array;
  };

  const ModuleCards = () => {
    const module_array = [];
    for (let i = 1; i <= nr_of_modules; i++) {
      const modulenr = "module" + i;
      if (moduledict[modulenr]) { // Check if module data exists
        module_array.push(
          <Card key={i} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, margin: 10, padding: 20 }}>
            <View style={styles}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{moduledict[modulenr]["module_name"]}</Text>
              <Activities activities={moduledict[modulenr]["activities"]} />
              <Text>Points Challenge benodigde punten: {moduledict[modulenr]["points_challenge_points"]}</Text>
              <Text>{moduledict[modulenr]["context_challenge_name"]}</Text>
              <Text>{moduledict[modulenr]["core_assignment_name"]}</Text>
            </View>
          </Card>
        );
      }
    }
    return (
      <View style={styles.container}>
        {module_array}
      </View>
    );
  };

  return (
    <Layout>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{course_name} Modules</Text>
      <Button
        onPress={() => navigation.navigate('AddModuleTeacher', { course_id })}
        title={"Voeg module toe"}
      />
      <ModuleCards />
    </Layout>
  );
};

export default ModulePageTeacher;
