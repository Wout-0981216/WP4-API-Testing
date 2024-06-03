import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://192.168.56.1:8000/game/HomeCourses', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Server response:', data.teacher);
          if (response.status === 200) {
            setAuthenticated(true);
            if (data.teacher === true) { 
              console.log("true")
              setIsTeacher(true);
            } else {
              setIsTeacher(false); 
            }
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.log('Error during token validation:', error);
          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              const refreshResponse = await fetch('http://192.168.56.1:8000/login/refresh-token/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: refreshToken })
              });
              if (!refreshResponse.ok) {
                throw new Error('Token refresh failed');
              }
              const refreshData = await refreshResponse.json();
              const newAccessToken = refreshData.access_token;
              await AsyncStorage.setItem('access_token', newAccessToken);
              setAuthenticated(true);
            } else {
              throw new Error('No refresh token available');
            }
          } catch (refreshError) {
            console.log('Error during token refresh:', refreshError);
            setAuthenticated(false);
          }
        }
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, isTeacher }}>
      {children}
    </AuthContext.Provider>
  );
};
