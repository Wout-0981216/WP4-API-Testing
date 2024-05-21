import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem('refresh_token');
      return axiosInstance
        .post('/login/refresh/', { refresh: refreshToken })
        .then(async (res) => {
          if (res.status === 200) {
            await AsyncStorage.setItem('access_token', res.data.access);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
            return axiosInstance(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
