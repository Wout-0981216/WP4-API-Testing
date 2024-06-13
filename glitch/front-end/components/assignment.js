import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button } from 'react-native';
import { green, red } from '@mui/material/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Assignment = ({ route, navigation }) => {
    const { concept_id, styles } = route.params;
    const [module_id, setModule_id] = useState('');
    const [assignment, setAssignment] = useState([]);

    useEffect(() => {
        // uit database halen
        const get_concept_info = async () => {
          try{
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`http://192.168.56.1:8000/game/api/concept-opdracht/${concept_id}/`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setModule_id(data.module_id)
                setAssignment(data.assignment_info[0]);
              }
        catch(error) {
          console.error('Er is een fout opgetreden bij het ophalen van de activiteiten', error);
        }
      };
      get_concept_info()
    }, [concept_id]);

    return (
        <View>
            <Button onPress={() => navigation.goBack()} title='Terug'/>
                <View style={styles.coursesContainer}>
                    <View style={styles.courseBlock}>
                        <View style={styles.courseHeader}>
                        <Text style={styles.courseTitleLeft}>{assignment.naam}</Text>
                        </View>
                            {assignment.progress === true ? (
                            <>
                            <Text style={{color: "green"}}>{assignment.beschrijving}</Text>
                            </>
                            ) : (
                            <>
                            <Text style={{color: "red"}}>{assignment.beschrijving}</Text>
                            </>
                            )}
                    </View>
                </View>
        </View>
    );
};

export default Assignment;
