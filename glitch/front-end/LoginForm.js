import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import bannerimage from './src/images/image1.jpg';
import Typography from '@mui/material/Typography';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setAuthenticated } = useContext(AuthContext);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = { username, password };
      const response = await axiosInstance.post('/login/login/', user);

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem('access_token', response.data.access);
        await AsyncStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        setAuthenticated(true);
        navigation.navigate('Home');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthenticated(true);
        navigation.navigate('Home');
      }
    };

    checkAuth();
  }, [setAuthenticated, navigation]);

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
          <Typography style={styles.subheading} variant="h2">Login</Typography>
          <Input
            label="Gebruikersnaam"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Typ je gebruikersnaam"
          />
          <Input
            label="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Typ je wachtwoord"
          />
          <View style={{ width: '100%' }}>
            <Button
              title="Login"
              onPress={handleSubmit}
              buttonStyle={styles.button_orange}
              titleStyle={{ fontSize: 30 }}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
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
});

export default LoginForm;