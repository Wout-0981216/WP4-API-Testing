import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Registration from './Registration';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Registreer hier!</Text>
      <StatusBar style="auto" />
      <Registration style={styles.register}/>
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
