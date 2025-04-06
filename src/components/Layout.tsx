import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Shield, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, toggleTheme, isDarkMode }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
          boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
        }}
      >
        <Toolbar>
          <Shield size={24} style={{ marginRight: '8px' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            HoneyGuard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { opacity: 0.8 },
              }}
            >
              Dashboard
            </Typography>
            <Typography
              component={RouterLink}
              to="/arp-spoofing"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { opacity: 0.8 },
              }}
            >
              ARP Spoofing
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;