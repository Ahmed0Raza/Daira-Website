import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationItems from './navItems';
import { useAdminAuth } from '../../../pages/admin/auth/adminAuth';

const AdminSidebar = ({ leftSpan }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(isLargeScreen);
  const [activeButton, setActiveButton] = useState('');
  const [expandedButton, setExpandedButton] = useState(null); // New state for expanded button
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();

  useEffect(() => {
    setIsDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentPathName = currentPath.split('/')[2];
    const currentPathNameCapitalized =
      currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1);
    setActiveButton(currentPathNameCapitalized);
  }, [location]);

  const handleClick = (item) => {
    navigate(item.link);
    setActiveButton(item.name);

    if (item.subItems) {
      if (expandedButton === item.name) {
        setExpandedButton(null);
      } else {
        setExpandedButton(item.name);
      }
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const CustomButton = ({ item, sx }) => {
    const isActive = activeButton === item.name;

    return (
      <Button
        sx={{
          ...sx,
          display: 'flex',
          padding: '16px 16px 16px 16px',
          alignItems: 'left',
          gap: '3px',
          alignSelf: 'stretch',
          overflow: 'hidden',
          color: theme.palette.buttonSidebar.ColorActive,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          textTransform: 'none',
          fontWeight: isActive ? 500 : 200,
          lineHeight: '140%',
          height: '40px',
          justifyContent: 'left',
          borderRight: isActive
            ? theme.palette.buttonSidebar.borderright
            : 'none',
          backgroundColor: isActive
            ? theme.palette.buttonSidebar.main
            : theme.palette.buttonSidebar.BackgroundColorActive,
          '&:hover': {
            backgroundColor: theme.palette.buttonSidebar.main,
          },
        }}
        onClick={() => handleClick(item)}
        startIcon={item.icon}
      >
        {item.name}
      </Button>
    );
  };

  const CustomButton2 = ({ item, sx }) => {
    const isActive = activeButton === item.name;

    return (
      <Button
        sx={{
          ...sx,
          display: 'flex',
          padding: '16px 16px 16px 32px',
          alignItems: 'left',
          gap: '3px',
          alignSelf: 'stretch',
          overflow: 'hidden',
          color: theme.palette.buttonSidebar.ColorActive,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          textTransform: 'none',
          fontWeight: isActive ? 550 : 400,
          lineHeight: '140%',
          height: '40px',
          justifyContent: 'left',
          borderRight: isActive
            ? theme.palette.buttonSidebar.borderright
            : 'none',
          backgroundColor: isActive
            ? theme.palette.buttonSidebar.main
            : theme.palette.buttonSidebar.BackgroundColorActive,
          '&:hover': {
            backgroundColor: theme.palette.buttonSidebar.main,
          },
        }}
        onClick={() => {
          logout();
          navigate(item.link);
        }}
        startIcon={item.icon}
      >
        {item.name}
      </Button>
    );
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          display: isLargeScreen ? 'none' : 'flex',
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: theme.zIndex.drawer + 1,
          color: theme.palette.buttonSidebar.ColorActive,
          backgroundColor: theme.palette.buttonSidebar.main,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        elevation={4}
        variant={isLargeScreen ? 'permanent' : 'temporary'}
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            paddingBottom: '24px',
            backgroundColor: theme.palette.buttonSidebar.hovertextcolor,
            boxShadow: theme.palette.buttonSidebar.sidebarshadow,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '0 0 3rem 0',
          }}
        >
          {NavigationItems.map((item, index) => (
            <React.Fragment key={index}>
              <CustomButton item={item} />
              {item.subItems &&
                expandedButton === item.name &&
                item.subItems.map((subItem, subIndex) => (
                  <CustomButton
                    key={subIndex}
                    item={subItem}
                    sx={{ marginLeft: 2 }}
                  />
                ))}
            </React.Fragment>
          ))}
          <CustomButton2
            item={{
              name: 'Log out',
              link: '/batman/admin/login',
              icon: (
                <PowerSettingsNewOutlinedIcon
                  style={{ color: theme.palette.buttonSidebar.ColorActive }}
                />
              ),
            }}
            sx={{ marginTop: 'auto' }}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default AdminSidebar;
