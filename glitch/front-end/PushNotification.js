import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Notification = ({ message, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.notification}>
      <Text style={styles.notificationText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    bottom: 50,
    left: '10%',
    right: '10%',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Notification;
