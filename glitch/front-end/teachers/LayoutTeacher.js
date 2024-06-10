import React from 'react';
import { View, ScrollView } from 'react-native';

export default function Layout({ children }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
