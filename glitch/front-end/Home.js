import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import axios from 'axios';

function HomePage() {
  const { authenticated, loading, logout } = useAuth();
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      if (authenticated) {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          'http://localhost:8000/login/home/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log('Fout bij het ophalen van de gegevens:', error);
      logout();
    }
  };


  if (authenticated) {
    fetchData();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>Welkom op mijn React Homepage!</h1>
      <p>{message}</p>
    </div>
  );
}

export default HomePage;
