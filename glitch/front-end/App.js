import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './AuthProvider';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './LoginForm';
import HomePage from './Home';
import RegistrationForm from './Registration';
import Assignment from './components/assignment';

import ActivitiesPage from './components/activities-module';
import ProfilePage from './components/ProfilePage';
import ModulePage from './components/ModulePage';
import TeacherHome from './teachers/HomeTeacher';
import ProfilePageTeacher from './teachers/ProfilePageTeacher';
import ModulePageTeacher from './teachers/ModulePageTeacher';
import AddModuleTeacher from './teachers/AddModuleTeacher';
import CoursesScreen from './teachers/CoursesScreen';
import CoursePage from './components/CoursePage';


const Tab = createBottomTabNavigator();

const StudentTabs = () => (
  <Tab.Navigator backBehavior='history'>
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
    <Tab.Screen name="Course" component={CoursePage} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="Module" component={ModulePage} options={{ tabBarButton: ()=> null }} />
    <Tab.Screen name="ConceptAssignment" component={Assignment} options={{ tabBarLabel: 'Concept', tabBarButton: () => null }}/>
    <Tab.Screen name="ActivitiesModule" component={ActivitiesPage} options={{ tabBarButton: () => null }}/>
  </Tab.Navigator>
);

const TeacherTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="TeacherHome" component={TeacherHome} />
    <Tab.Screen name="Leerlingen" component={CoursesScreen} />
    <Tab.Screen name="TeacherProfile" component={ProfilePageTeacher} />
    <Tab.Screen name="TeacherModule" component={ModulePageTeacher} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="AddModuleTeacher" component={AddModuleTeacher} options={{ tabBarButton: () => null }} />

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
