import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './AuthProvider';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './LoginForm';
import HomePage from './Home';
import RegistrationForm from './Registration';
import Assignment from './assignment';
import ActivitiesPage from './activities-module';
import ProfilePage from './components/ProfilePage';
import ModulePage from './components/ModulePage'
import TeacherHome from './teachers/HomeTeacher';
import ProfilePageTeacher from './teachers/ProfilePageTeacher';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Auth">
    <Stack.Screen
      name="Login"
      component={LoginForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegistrationForm}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ConceptAssignment"
      component={Assignment}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ActivitiesModule"
      component={ActivitiesPage}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator initialRouteName="Home">

    {/* Leerlingen */}

    <Stack.Screen
      name="Home"
      component={HomePage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profiel"
      component={ProfilePage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Module"
      component={ModulePage}
      options={{ headerShown: false}}
    />


    {/* Teachers: */}

    <Stack.Screen
      name="TeacherHome"
      component={TeacherHome}  
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name="TeacherProfiel"
      component={ProfilePageTeacher}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);


const App = () => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {authenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};


export default function MainApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});