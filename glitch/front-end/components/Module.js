import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable} from 'react-native';
import { Input, Icon, Button, Card } from '@rneui/themed';
import { Grid, Typography, LinearProgress } from '@mui/material';
import Layout from '../Layout'

const CoursePage = ({route, navigation}) => {
  const {module_id, styles} = route.params;
  const[module_info, setModule_info] = useState([]);

  useEffect(() => {
    const get_module_info = async () => {
      try{
        const response = await fetch(`http://127.0.0.1:8000/game/api/module/${module_id}/`, {
                method: 'GET',
            });
            const data = await response.json();
            setModule_info(data.module);
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    get_module_info();
  }, []);
}