import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const RegistrationForm = () => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrftoken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/authentication/api/csrf/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen van de CSRF-token:', error);
      }
    };

    getCsrfToken();
  }, []);

  const submitForm = async (first_name, last_name, username, email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/authentication/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({ first_name, last_name, username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          setSuccessMessage('Succesvol geregistreerd');
          window.location.href = '/';
        }, 1000);
      } else {
        throw new Error('Network not OK');
      }
    } catch (error) {
      console.error('Er is een fout opgetreden bij het registreren van de gebruiker:', error);
      setError('fout');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm(first_name, last_name, username, email, password);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      {error || successMessage ? (
        <Text style={styles.message}>{error ? error : successMessage}</Text>
      ) : null}

      <Text style={styles.heading}>Registratieformulier</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Voornaam:</Text>
        <TextInput
          style={styles.input}
          value={first_name}
          onChangeText={setFirst_name}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Achternaam:</Text>
        <TextInput
          style={styles.input}
          value={last_name}
          onChangeText={setLast_name}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gebruikersnaam:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Wachtwoord:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registreren</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text>
            U heeft al een account? 
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#CA591A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  loginLink: {
    color: '#0000ff',
    textDecorationLine: 'underline',
  }
});

export default RegistrationForm;
