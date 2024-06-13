import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button } from 'react-native';
import { green, red } from '@mui/material/colors';

const ActivitiesPage = ({ route, navigation }) => {
    const { activity_id, styles } = route.params;
    const [module_id, setModule_id] = useState('');
    const [activiteiten, setActiviteiten] = useState([]);
    const [niveaus, setNiveaus] = useState([]);

    useEffect(() => {
        const get_activity_info = async () => {
          try{
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`http://192.168.56.1:8000/game/api/activity/${activity_id}/`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setModule_id(data.module_id);
                setActiviteiten(data.activity_info[0]);
                setNiveaus(data.niveau_info)
              }
        catch(error) {
          console.error('Er is een fout opgetreden bij het ophalen van de activiteiten', error);
        }
      };
      get_activity_info()
    }, [activity_id]);

    const handleSubmit = (activiteitId) => {
    // inlever knop
    }

    return (
    <View>
      <Button onPress={() => navigation.goBack()} title='Terug'/>
      <View style={styles.coursesContainer}>
        <View style={styles.courseBlock}>
          <View style={styles.courseHeader}>
          <Text style={styles.courseTitleLeft}>{activiteiten.naam}</Text>
          </View>
            <Text>Beschrijving: {activiteiten.beschrijving}</Text>
            {niveaus.map(niveau => (
                <li key={niveau.id}>
                  {niveau.progress === true ? (
                  <>
                  <Text style={{color: "green"}}>{niveau.beschrijving}</Text>
                  </>
                ) : (
                  <>
                  <Text style={{color: "red"}}>{niveau.beschrijving}</Text>
                  </>
                )
              }
                </li>
                ))}
        </View>
      </View>
    </View>
    )
};

export default ActivitiesPage;