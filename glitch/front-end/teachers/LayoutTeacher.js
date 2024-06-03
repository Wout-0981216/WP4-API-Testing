import React from 'react';
import { View, Text } from 'react-native';

export default function Layout({ children }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
