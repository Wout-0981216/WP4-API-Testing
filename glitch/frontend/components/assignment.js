import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Assignment = ({ route, navigation }) => {
    const { concept_id } = route.params;
    const [module_id, setModule_id] = useState('');
    const [assignment, setAssignment] = useState({});
    const [submittedText, setSubmittedText] = useState('');
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        const getConceptInfo = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const response = await fetch(`http://192.168.56.1:8000/game/api/concept-opdracht/${concept_id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setModule_id(data.module_id);
                setAssignment(data.assignment_info[0]);
                if (data.assignment_info[0].progress === 1) {
                    setSubmittedText(data.assignment_info[0].ingeleverde_tekst);
                } else {
                    setSubmittedText('');
                }
            } catch (error) {
                console.error('Er is een fout opgetreden bij het ophalen van de opdracht', error);
            }
        };
        getConceptInfo();
    }, [concept_id, reloadData]);

    const handleTextSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch('http://192.168.56.1:8000/game/api/submit_text/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignment_id: concept_id,
                    assignment_type: 'concept',  
                    submitted_text: submittedText,
                }),
            });

            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                Alert.alert('Inleveren tekst', 'Tekst succesvol ingeleverd');
                setReloadData(prev => !prev);
            } else {
                Alert.alert('Fout', 'Er is een fout opgetreden bij het inleveren van de tekst');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden bij het inleveren van de tekst', error);
            Alert.alert('Fout', 'Er is een fout opgetreden bij het inleveren van de tekst');
        }
    };

    const getStatusColor = () => {
        switch (assignment.progress) {
            case 0:
                return 'red'; 
            case 1:
                return 'orange';
            case 2:
                return 'green'; 
            case 4:
                return 'red';
            default:
                return 'black';
        }
    };

    return (
        <View>
            <View style={styles.backButtonSize}>
                <Button onPress={() => navigation.goBack()} title='Terug'/>
            </View>
            <View style={styles.coursesContainer}>
                <View style={styles.courseBlock}>
                    <View style={styles.courseHeader}>
                        <Text style={[styles.courseTitleLeft]}>{assignment.naam}</Text>
                    </View>
                    <Text>{assignment.beschrijving}</Text>
                    <Text style={{color: getStatusColor()}}>Status: {assignment.progress === 0 ? 'Niet ingeleverd' : assignment.progress === 1 ? 'Ingeleverd' : assignment.progress === 2 ? 'Goedgekeurd' : 'Afgekeurd'}</Text>
                    
                    {(assignment.progress === 0 || assignment.progress === 1 || assignment.progress === 3) && <TextInput
                        style={styles.textInput}
                        placeholder={
                            assignment.progress === 0
                                ? 'Vul hier je tekst in'
                                : assignment.progress === 1
                                ? assignment.handed_in_text || 'Je hebt nog geen tekst ingeleverd'
                                : ''
                        }
                        onChangeText={text => setSubmittedText(text)}
                        value={submittedText}
                        multiline={true}
                        numberOfLines={4}
                    />}
                    {(assignment.progress === 0 || assignment.progress === 1 || assignment.progress === 3) && <Button onPress={handleTextSubmit} title="Core Assignment Inleveren" />}


                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    coursesContainer: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
    },
    courseBlock: {
        marginVertical: 10,
    },
    courseHeader: {
        marginBottom: 10,
    },
    courseTitleLeft: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    backButtonSize: {
        width: 200,

    },
});

export default Assignment;