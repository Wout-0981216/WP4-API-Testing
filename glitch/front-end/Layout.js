import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Layout({ children }) {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // const navigation = useNavigation()
  // const menuItems = [
  //   { text: 'Home', icon: <HomeIcon />, location: "Home" },
  //   { text: 'Cursussen', icon: <SchoolIcon />, location: "Home" },
  //   { text: 'Profiel', icon: <AccountCircleIcon />, location: "Profiel" },
  //   { text: 'Studenten', icon: <AccountCircleIcon />, location: "CoursesScreen" }
  // ];

  // const handleMenuItemPress = (path) => {
  //   navigation.navigate(path);
  // };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
