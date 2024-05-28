import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigation } from '@react-navigation/native';

const drawerWidth = 240;

export default function Layout({ children }) {
  const navigation = useNavigation()
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, location: "Profiel" },
    { text: 'Cursussen', icon: <SchoolIcon />, location: "Profiel" },
    { text: 'Profiel', icon: <AccountCircleIcon />, location: "Profiel" }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h4" component="div" sx={{ p: 2, fontWeight: 'bold' }}>
            GLITCH
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigation.navigate(item.location, {screen: "Profiel"})}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'white', minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}
