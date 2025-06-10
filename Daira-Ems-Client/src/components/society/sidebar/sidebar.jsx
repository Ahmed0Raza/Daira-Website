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
import DairaLogo from '../../../images/daira_logo.jpg';
import NavigationItems from './navItems';
import { useUserAuth } from '../../../pages/user/auth/userAuth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '@mui/material';

const SocietySidebar = () => {
  const { logout } = useUserAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const sideList = () => (
    <Box
      sx={{
        width: '100%', // 'auto
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
          style={{ width: '100%', maxWidth: 150 }}
        />
      </Box>
      <List>
        {NavigationItems.map((item, index) => (
          <ListItem
            key={index}
            component={Link}
            to={item.link}
            sx={{
              // apply different styles based on the current route
              bgcolor:
                location.pathname === item.link ? 'primary.main' : 'inherit',
              color:
                location.pathname === item.link
                  ? 'primary.contrastText'
                  : 'inherit',
              '&:hover': {
                backgroundColor:
                  location.pathname === item.link
                    ? 'primary.light'
                    : colors.grey[110],
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.link ? 'inherit' : 'action.active',
              }}
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
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ m: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {sideList()}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 250,
            backgroundColor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
          }}
        >
          {sideList()}
        </Box>
      )}
    </Box>
  );
};

export default SocietySidebar;
