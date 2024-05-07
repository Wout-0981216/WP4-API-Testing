import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProfilePage from './components/ProfilePage';

export default function App() {
  return (
    <View style={styles.container}>
      <ProfilePage />
      <StatusBar style="auto" />
    </View>
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
