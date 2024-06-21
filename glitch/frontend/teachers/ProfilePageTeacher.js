import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '@rneui/themed';
import LayoutTeacher from './LayoutTeacher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Notification from '../PushNotification';
import { AuthContext } from '../AuthProvider';

const ProfilePageTeacher = () => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [date_joined, setDate_joined] = useState('');
  const [update_page, setUpdate] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://192.168.56.1:8000/game/api/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        setFirst_name(data.first_name);
        setLast_name(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
        setPassword(data.password);
        setDate_joined(data.date_joined);
        console.log(data.message);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de gebruikersinformatie', error);
      }
    };
    getUserInfo();
  }, [refreshKey]);

  const submitForm = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://192.168.56.1:8000/game/api/profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ first_name, last_name, username, email, password }),
      });
      const data = await response.json();
          if (response.ok) {
      setShowNotification(true);
    }
      setUpdate(!update_page);
      console.log(data.message);
      alert(data.message);
      setIsEditing(false);
      setShowNotification(true);
    } catch (error) {
      console.error('Er is een fout opgetreden bij het aanpassen van het profiel:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <LayoutTeacher>
      <View>
        <Text style={styles.text}>Profiel pagina test</Text>
        {isEditing ? (
          <View style={styles.editProfile}>
            <Input
              label="Voornaam"
              value={first_name}
              onChangeText={(value) => setFirst_name(value)}
            />
            <Input
              label="Achternaam"
              value={last_name}
              onChangeText={(value) => setLast_name(value)}
            />
            <Input
              label="Gebruikersnaam"
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
            <Input
              label="Email"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
            <Input
              label="Wachtwoord"
              onChangeText={(value) => setPassword(value)}
            />
            <TouchableOpacity onPress={submitForm}>
              <Text style={styles.buttonText}>Gegevens aanpassen</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.buttonText}>Annuleren</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.showProfile}>
            <Text style={styles.text}>Voornaam: {first_name}</Text>
            <Text style={styles.text}>Achternaam: {last_name}</Text>
            <Text style={styles.text}>Gebruikersnaam: {username}</Text>
            <Text style={styles.text}>Email: {email}</Text>
            <Text style={styles.text}>Gebruiker sinds: {date_joined}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Profiel aanpassen</Text>
            </TouchableOpacity>
            <Notification message="Profiel succesvol bijgewerkt" visible={showNotification} />
          </View>
        )}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.buttonText}>Uitloggen</Text>
        </TouchableOpacity>
      </View>
    </LayoutTeacher>
  );
};

export default ProfilePageTeacher;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
    marginTop: 10,
    padding: 10,
    textAlign: 'center',
  },
  showProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  editProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
