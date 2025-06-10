import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DairaLogo from '../../../images/Daira 2025 (Logo for Light).png';
import NavigationItems from './navItems';
import { useAccommodationAuth } from '../../../pages/accommodation/auth/accommodationAuth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '@mui/material';

const Sidebar = () => {
  const { logout } = useAccommodationAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/accommodation/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const sideList = () => (
    <Box
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <img
          src={DairaLogo}
          alt="Daira Logo"
          style={{ width: 160, height: 'auto', marginLeft: '-10px' }}
        />
      </Box>
      <List>
        {NavigationItems.map((item, index) => (
          <ListItem
            key={index}
            component={Link}
            to={item.link}
            sx={{
              bgcolor: location.pathname === item.link ? '#FFC107' : 'inherit',
              color: location.pathname === item.link ? 'black' : 'inherit',
              '&:hover': {
                backgroundColor:
                  location.pathname === item.link ? '#E6B800' : colors.grey[100],
              },
            }}
          >
            <ListItemIcon
              sx={{ color: location.pathname === item.link ? 'black' : 'action.active' }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          p: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FFC107',
            color: '#000',
            '&:hover': {
              backgroundColor: '#E0A800',
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '60px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
          paddingX: 2,
          paddingY: 1,
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{
            fontWeight: 'bold',
            color: '#50149F',
            fontFamily: '"Poppins", sans-serif',
            fontSize: { xs: 14, md: 18 },
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Welcome
        </Box>
      </Box>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {sideList()}
      </Drawer>

      {/* Fixed Sidebar for Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            backgroundColor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            pt: '60px',
            overflowY: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box',
            maxWidth: 250,
          }}
        >
          {sideList()}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
