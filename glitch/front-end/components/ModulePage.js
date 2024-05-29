import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Input, Icon, Button, Card } from '@rneui/themed';
import { Grid, Typography, LinearProgress } from '@mui/material';
import { FlatGrid } from 'react-native-super-grid';
import Layout from '../Layout'

const ModulePage = ({route, navigation}) => {
  const {course_id, styles} = route.params;
  const[course_name, setCourse_name] = useState('');
  const[moduledict, setModule_dict] = useState({})
  const[nr_of_modules, setNr_of_modules] = useState('')
  const[csrftoken, setCsrfToken] = useState('');

  useEffect(() => {
    // const getCsrfToken = async () => {
    //   try {
    //       const response = await fetch('http://127.0.0.1:8000/game/api/csrf/', {
    //           method: 'GET',
    //           credentials: 'include',
    //       });
    //       const data = await response.json();
    //       setCsrfToken(data.csrfToken);
    //   } catch (error) {
    //       console.error('Er is een fout opgetreden bij het ophalen van de CSRF-token:', error);
    //   }
    // };

    const get_module_info = async () => {
      try{
        const response = await fetch(`http://127.0.0.1:8000/game/api/module/${course_id}/`, {
                method: 'GET',
                //credentials: 'include',
            });
            const data = await response.json();
            setCourse_name(data.course_name);
            setNr_of_modules(data.nr_of_modules)
            setModule_dict(data.module_list)
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    //getCsrfToken();
    get_module_info();
  }, []);

  function Activities(activities) {
    const activities_array = []
    for(let i=1; i <= nr_of_modules; i++){
      const activitynr = "activity"+i;
      activities_array.push(
        <Text>{activities["activities"][activitynr]}</Text>
      )
    }
    return(
      activities_array
    )
  }

  function ModuleCards() {
    const module_array = [];
    for(let i=1; i <= nr_of_modules; i++) {
      const modulenr = "module"+i;
      module_array.push(
      {key :<Card style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)"}}>
        <View style={styles}>
          <Typography variant="h4" style={{fontWeight: 'bold'}}>{moduledict[modulenr]["module_name"]}</Typography>
          <Activities activities={moduledict[modulenr]["activities"]}/>
          <Text>Points Challenge  benodigde punten: {moduledict[modulenr]["points_challenge_points"]}</Text>
          <LinearProgress variant="determinate" value={moduledict[modulenr]["points_challenge_points"]} style={styles.progressBar} />
          <Text>{moduledict[modulenr]["context_challenge_name"]}</Text>
          <Text>{moduledict[modulenr]["core_assignment_name"]}</Text>
        </View>
      </Card>});
    }
    return(
      <View style={styles.container}>
        <FlatList 
          numColumns={3}
          data={module_array}
          renderItem={({item}) => item.key}
        />
      </View>
    )
  }

  return(
    <Layout>
      <Typography variant="h2" style={{fontWeight: 'bold'}}>{course_name} Modules</Typography>
        <ModuleCards/>
    </Layout>
  )
}

export default ModulePage;

