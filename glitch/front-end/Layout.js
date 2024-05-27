import React from 'react';
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
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Cursussen', icon: <SchoolIcon /> },
    { text: 'Profiel', icon: <AccountCircleIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      <CssBaseline />
      {isMobile ? (
        <BottomNavigation
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
            zIndex: 1201,
          }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'fixed',
              zIndex: 1200,
            },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            <Typography variant="h4" component="div" sx={{ p: 2, fontWeight: 'bold' }}>
              GLITCH
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isMobile ? 0 : 0,
          backgroundColor: 'white',
          minHeight: '100vh',
          overflow: 'auto',
          zIndex: 1100,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
