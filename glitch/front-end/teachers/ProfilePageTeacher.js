import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import Layout from '../Layout'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePageTeacher = () => {
  const[first_name, setFirst_name] = useState('');
  const[last_name, setLast_name] = useState('')
  const[username, setUsername] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[date_joined, setDate_joined] = useState('');
  const[csrftoken, setCsrfToken] = useState('');
  const[update_page, setUpdate] = useState(true);
  const style = styles;


  useEffect(() => {
  //   const getCsrfToken = async () => {
  //     try {
  //         const response = await fetch('http://127.0.0.1:8000/game/api/csrf/', {
  //             method: 'GET',
  //             credentials: 'include',
  //         });
  //         const data = await response.json();
  //         setCsrfToken(data.csrfToken);
  //     } catch (error) {
  //         console.error('Er is een fout opgetreden bij het ophalen van de CSRF-token:', error);
  //     }
  //   };

    const getUserInfo = async () => {
      try{
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/game/api/profile/', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                               //credentials: 'include',
            });
            const data = await response.json();
            setFirst_name(data.first_name);
            setLast_name(data.last_name);
            setUsername(data.username);
            setEmail(data.email);
            setPassword(data.password);
            setDate_joined(data.date_joined);
            console.log(data.message)
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    //getCsrfToken();
    getUserInfo();
  }, [update_page]);

  const submitForm = async (first_name,last_name,username, email, password) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/game/api/profile/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            //'X-CSRFToken': csrftoken,
            },
            //credentials: 'include',
            body: JSON.stringify({ first_name,last_name,username, email, password }),
        });
        const data = await response.json();
        console.log(data.message)
        alert(data.message)
        setUpdate(!update_page)
    } catch (error) {
        console.error('Er is een fout opgetreden bij het aanpassen van het profiel:', error);
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      submitForm(first_name,last_name,username, email, password);
  };

  const changePage = () => {
    var x = document.getElementById("show_profile");
    var y = document.getElementById("edit_profile");
    if (x.style.display === "none") {
      x.style.display = "block";
      y.style.display = "none";
    } else {
      x.style.display = "none";
      y.style.display = "block";
    }
    setUpdate(!update_page)
  };

  return (
    <Layout>
    <div>
      <h2>Profiel pagina</h2>
      <div id="show_profile">
        <div><Text style={style.Text}>Voornaam: {first_name}</Text></div>
        <div><Text style={style.Text}>Achternaam: {last_name}</Text></div>
        <div><Text style={style.Text}>Gebruikersnaam: {username}</Text></div>
        <div><Text style={style.Text}>Email: {email}</Text></div>
        <div><Text style={style.Text}>Wachtwoord: {password}</Text></div>
        <div><Text style={style.Text}>Gebruiker sinds: {date_joined}</Text></div>
      </div>
      <Button onPress={changePage}>Profiel aanpassen</Button>
      <form id="edit_profile" hidden="hidden">
        <div>
          <label>Voornaam:</label>
          <Input
            type="text"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
          />
        </div>
        <div>
          <label>Achternaam:</label>
            <Input
              type="text"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
            />
        </div>
        <div>
          <label>Gebruikersnaam:</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div>
          <label>Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
          <label>Wachtwoord:</label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <Button onPress={handleSubmit}>Gegevens aanpassen</Button>
      </form>
    </div>
    </Layout>
  );
};

export default ProfilePageTeacher;

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
  }
})