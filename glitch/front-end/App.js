import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './AuthProvider';
import { ActivityIndicator, View } from 'react-native';
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
import InspectStudent from './teachers/InspectStudent';
import CoursesScreen from './teachers/CoursesScreen';
import CoursePage from './components/CoursePage';
import CoreAssignment from './components/CoreAssignment';
import AddDomain from './teachers/AddDomain';
import AddCourse from './teachers/AddCourse';
import ShowStudent from './teachers/ShowStudent';

const Tab = createBottomTabNavigator();

const StudentTabs = () => (
  <Tab.Navigator backBehavior='history'>
    <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Profile" component={ProfilePage} options={{ tabBarLabel: 'Profiel' }} />
    <Tab.Screen name="Course" component={CoursePage} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="Module" component={ModulePage} options={{ tabBarButton: ()=> null }} />
    <Tab.Screen name="ConceptAssignment" component={Assignment} options={{ tabBarButton: () => null }}/>
    <Tab.Screen name="ActivitiesModule" component={ActivitiesPage} options={{ tabBarButton: () => null }}/>
    <Tab.Screen name="CoreAssignment" component={CoreAssignment} options={{ tabBarButton: () => null }}/>
  </Tab.Navigator>
);

const TeacherTabs = () => (
  <Tab.Navigator backBehavior='history'>
    <Tab.Screen name="TeacherHome" component={TeacherHome} options={{ tabBarLabel: 'Home' }}/>
    <Tab.Screen name="Leerlingen" component={CoursesScreen} options={{ tabBarLabel: 'Leerlingen' }}/>
    <Tab.Screen name="TeacherProfile" component={ProfilePageTeacher} options={{ tabBarLabel: 'Profiel' }}/>
    <Tab.Screen name="TeacherModule" component={ModulePageTeacher} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="AddModuleTeacher" component={AddModuleTeacher} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="InspectStudent" component={InspectStudent} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="AddDomain" component={AddDomain} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="AddCourse" component={AddCourse} options={{ tabBarButton: () => null }} />
    <Tab.Screen name="ShowStudent" component={ShowStudent} options={{ tabBarButton: () => null }} />
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
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