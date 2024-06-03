import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './AuthProvider';
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


const Tab = createBottomTabNavigator();

const StudentTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
    <Tab.Screen name="Module" component={ModulePage} options={{ tabBarButton: () => null }} />
  </Tab.Navigator>
);

const TeacherTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="TeacherHome" component={TeacherHome} />
    <Tab.Screen name="TeacherProfile" component={ProfilePageTeacher} />
  </Tab.Navigator>
);

const AuthTabs = () => (
  <Tab.Navigator initialRouteName="Login">
    <Tab.Screen
      name="Login"
      component={LoginForm}
      options={{ headerShown: false, tabBarLabel: 'Login', tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Register"
      component={RegistrationForm}
      options={{ headerShown: false, tabBarLabel: 'Register', tabBarButton: () => null }}
    />
    <Tab.Screen
      name="ConceptAssignment"
      component={Assignment}
      options={{ headerShown: false, tabBarLabel: 'Concept', tabBarButton: () => null }}
    />
    <Tab.Screen
      name="ActivitiesModule"
      component={ActivitiesPage}
      options={{ headerShown: false, tabBarLabel: 'Activities', tabBarButton: () => null }}
    />
  </Tab.Navigator>
);

const App = () => {
  const { authenticated, loading, isTeacher } = useContext(AuthContext);

  useEffect(() => {
    console.log('Authenticated:', authenticated);
    console.log('Is Teacher:', isTeacher);
  }, [authenticated, isTeacher]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {authenticated ? (isTeacher ? <TeacherTabs /> : <StudentTabs />) : <AuthTabs />}
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
