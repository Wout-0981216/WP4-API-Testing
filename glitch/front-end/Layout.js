import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Layout({ children }) {
  const navigation = useNavigation();

  const handleMenuItemPress = (path) => {
    navigation.navigate(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
