import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { LinearProgress } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowStudent = ({ route, navigation }) => {
  const { student_id, course_id } = route.params;
  const [modules, setModules] = useState({});
  const [activities, setActivities] = useState({});
  const [points_challenge, setPoints_challenge] = useState({});
  const [context_challenge, setContext_challenge] = useState({});
  const [core_assignment, setCore_assignment] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    const get_module_info = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch(`http://192.168.56.1:8000/teachers/api/student_module_info/${student_id}/${course_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        setModules(data.modules)
        setActivities(data.activiteiten);
        setPoints_challenge(data.punten_uitdagingen);
        setContext_challenge(data.concept_opdrachten);
        setCore_assignment(data.hoofd_opdrachten);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
      }
    };
    get_module_info();
  }, [student_id, course_id, isFocused]);

  function Activities(index) {
    const activities_array = [];
    for (const j in activities[index.index]) {
      activities_array.push(
        <View key={j}>
          <Text style={{ fontWeight: 'bold' }}>{`\n  -${activities[index.index][j]["naam"]}:`}</Text>
          <Niveaus niveaus={activities[index.index][j]["niveaus"]}/>
        </View>
      );
    }
    return activities_array;
  }
  function Niveaus(niveaus) {
    const niveau_array = [];
    for (i in niveaus.niveaus) {
      niveau_array.push(
        <View key={i}>
          <Text>{`\n      -${niveaus.niveaus[i]["beschrijving"]}  -  ${niveaus.niveaus[i]["progress"] == 1 ? 'afgerond' : 'nog niet afgerond'}`}</Text>
        </View>
      );
    }
    return niveau_array;
  }
  function Modules() {
    const module_array = [];
    for (const i in modules) {
      module_array.push(
        <View key={i} style={styles.courseBlock}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitleLeft}>{modules[i]["naam"]}</Text>
          </View>
          <View>
            <Text>Beschrijving module: {modules[i]['beschrijving']}</Text>
            <Text>{`\nActiviteiten:`}</Text>
          </View>
          <Activities index={i}/>
          <View style={{ flexDirection: 'row' }}>
            <Text>{`\nPoints Challenge behaalde punten: `}
              <Text style={{ fontWeight: 'bold' }}>{`${points_challenge[i]?.progress ?? 0}/15  `}</Text>
              <LinearProgress value={(points_challenge[i]?.progress ?? 0) / 15} style={styles.progressBarSmall} />
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>{`\nContext Challenge: `}
              <Text style={{ fontWeight: 'bold' }}> {context_challenge[i]?.naam ?? ''}
                {context_challenge[i]?.progress === 0 ? " - nog niet ingeleverd" :
                  context_challenge[i]?.progress === 1 ? " - ingeleverd" :
                  context_challenge[i]?.progress === 2 ? " - goedgekeurd" : " - afgekeurd"}
              </Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>{`\nCore Assignment: `}
              <Text style={{ fontWeight: 'bold' }}> {core_assignment[i]?.naam ?? ''}
                {core_assignment[i]?.progress === 0 ? " - nog niet ingeleverd" :
                  core_assignment[i]?.progress === 1 ? " - ingeleverd" :
                  core_assignment[i]?.progress === 2 ? " - goedgekeurd" : " - afgekeurd"}
              </Text>
            </Text>
          </View>
        </View>
      );
    }
    return module_array;
  }

  return (
    <ScrollView>
      <View style={{width: 200}}>
        <Button onPress={() => navigation.goBack()} title='Terug'/>
      </View>
      <View style={styles.coursesContainer}>
        <Modules />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backButtonSize: {
    margin: 10,
  },
  coursesContainer: {
    padding: 10,
  },
  courseBlock: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 20,
  },
  courseHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  courseTitleLeft: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarSmall: {
    width: '100%',
    marginTop: 5,
  },
});

export default ShowStudent;