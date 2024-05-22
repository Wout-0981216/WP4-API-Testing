import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';
import { ActivityIndicator, View } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axiosInstance.get('/login/validate-token/');
          if (response.status === 200) {
            setAuthenticated(true);
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              const refreshResponse = await axiosInstance.post('/login/refresh-token/', { refresh_token: refreshToken });
              if (refreshResponse.status === 200) {
                const newAccessToken = refreshResponse.data.access_token;
                await AsyncStorage.setItem('access_token', newAccessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                setAuthenticated(true);
              } else {
                throw new Error('Token refresh failed');
              }
            } else {
              throw new Error('No refresh token available');
            }
          } catch (refreshError) {
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
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
