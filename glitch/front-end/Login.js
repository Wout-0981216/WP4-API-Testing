import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

import bannerimage from './src/images/image1.jpg';

import './src/css/styles.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Login successful');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.section_small}>
            <Text h1Style={{ fontSize: 200, fontFamily: 'jomhuria', height: 130 }} h1>GLITCH</Text>
            <Text style={{ fontSize: 35, marginBottom: 100}}>LOGIN</Text>

            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your username"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
            />
            <View style={{ width: '100%' }}>
            <Button
              title="Login"
              onPress={handleSubmit}
              buttonStyle={[styles.button_orange, { width: '100%' }]}
              titleStyle={{ fontSize: 30, fontFamily: 'Arial' }}
            />
          </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
        </View>
      </View>
      <Image
        source={bannerimage}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E6E6E8',
  },
  section: {
    width: '50%',
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
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  heading: {
    fontWeight: 'bold',
  },
  button_orange: {
    backgroundColor: '#CA591A',
    marginTop: 10,
    width: '100%',

  },
  image: {
    width: '50%', 
    height: '100%', 
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default LoginForm;
