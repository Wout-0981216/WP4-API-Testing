import React, { useState, useEffect, useContext } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import bannerimage from './src/images/image1.jpg';
import Typography from '@mui/material/Typography';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const RegistrationForm = () => {
  const [domains, setDomains] = useState([]);
  const [chosen_domain, setChosen_domain] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const get_domains = async () => {
      try{
        const response = await fetch(`http://192.168.56.1:8000/game/api/domains/`, {
                method: 'GET',
            });
            const data = await response.json();
            setDomains(data.domain_list);
          } catch (error) {
            console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
          }
    };
    get_domains()
  },[])

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = { first_name, last_name, username, email, password, chosen_domain };
      const response = await axiosInstance.post('/authentication/api/register/', user);

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        setAuthenticated(true);
        navigation.navigate('Home');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Er is een fout opgetreden bij het registreren');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.section_small}>
          <Typography style={styles.heading} variant="h1">Glitch</Typography>
          <Typography style={styles.subheading} variant="h2">Registreren</Typography>
          <Input
            label="Voornaam"
            value={first_name}
            onChangeText={setFirst_name}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ je voornaam"
          />
          <Input
            label="Achternaam"
            value={last_name}
            onChangeText={setLast_name}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ je achternaam"
          />
          <Input
            label="Gebruikersnaam"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ je gebruikersnaam"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Typ je email"
          />
          <Input
            label="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Typ je wachtwoord"
          />
          <RNPickerSelect
            onValueChange={(value) => setChosen_domain(value)}
            items={domains} 
          />
          <View style={{ width: '100%' }}>
            <Button
              title="Registreren"
              onPress={handleSubmit}
              buttonStyle={styles.button_orange}
              titleStyle={{ fontSize: 30 }}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.loginText}>
            Heb je al een account? 
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Log hier in</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={bannerimage}
          style={isMobile ? styles.imageMobile : styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6E6E8',
  },
  section: {
    width: isMobile ? '100%' : '50%',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section_small: {
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: isMobile ? '100%' : '50%',
    height: isMobile ? 'auto' : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  heading: {
    fontSize: 100,
  },
  subheading: {
    fontSize: 35,
    marginBottom: 100,
  },
  button_orange: {
    backgroundColor: '#CA591A',
    marginTop: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageMobile: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 20,
    borderRadius: 10,
  },
  loginText: {
    marginTop: 20,
  },
  loginLink: {
    color: '#0000ff',
    textDecorationLine: 'underline',
  },
});

export default RegistrationForm;
