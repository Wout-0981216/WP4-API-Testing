import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './AuthProvider';
import LoginForm from './LoginForm';
import HomePage from './Home';
import RegistrationForm from './Registration';
import Assignment from './assignment';
import ActivitiesPage from './activities-module';

const Stack = createStackNavigator();

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
    <Stack.Screen
      name="Home"
      component={HomePage}
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
