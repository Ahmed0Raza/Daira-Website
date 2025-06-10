'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
  Collapse,
  alpha,
} from '@mui/material';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationItems from './navItems';
import { useInvitationAuth } from '../../../pages/invitations/auth/invitationsAuth';

const InvitationsSidebar = ({ leftSpan }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(isLargeScreen);
  const [activeButton, setActiveButton] = useState('');
  const [expandedButton, setExpandedButton] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useInvitationAuth();

  useEffect(() => {
    setIsDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentPathName = currentPath.split('/')[2];
    const currentPathNameCapitalized =
      currentPathName?.charAt(0).toUpperCase() + currentPathName?.slice(1) ||
      '';
    setActiveButton(currentPathNameCapitalized);

    // Auto-expand parent menu if a child is active
    NavigationItems.forEach((item) => {
      if (
        item.subItems &&
        item.subItems.some(
          (subItem) => subItem.name === currentPathNameCapitalized
        )
      ) {
        setExpandedButton(item.name);
      }
    });
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

    // Close drawer on mobile after navigation
    if (!isLargeScreen) {
      setIsDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const NavButton = ({ item, isSubItem = false, sx = {} }) => {
    const isActive = activeButton === item.name;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedButton === item.name;

    return (
      <Button
        sx={{
          display: 'flex',
          padding: isSubItem ? '12px 16px 12px 32px' : '14px 16px',
          alignItems: 'center',
          gap: '10px',
          alignSelf: 'stretch',
          overflow: 'hidden',
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.text.primary,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '15px',
          textTransform: 'none',
          fontWeight: isActive ? 500 : 400,
          lineHeight: '140%',
          minHeight: isSubItem ? '40px' : '48px',
          justifyContent: 'flex-start',
          borderRadius: '0',
          marginBottom: '0',
          marginLeft: isSubItem ? '12px' : '0',
          marginRight: '0',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          borderLeft: isActive
            ? `3px solid ${theme.palette.primary.main}`
            : '3px solid transparent',
          backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.05)
            : 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette.action.hover, 0.05),
            color: theme.palette.primary.main,
          },
          ...sx,
        }}
        onClick={() => {
          if (item.name === 'Log out') {
            logout();
          }
          handleClick(item);
        }}
        fullWidth
        endIcon={
          hasSubItems &&
          (isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)
        }
      >
        <Typography
          component="span"
          sx={{
            flexGrow: 1,
            textAlign: 'left',
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {item.name}
        </Typography>
      </Button>
    );
  };

  // Increased drawer width
  const drawerWidth = isMediumScreen ? 320 : 340;

  return (
    <>
      {/* Hamburger button - now visible on all screen sizes when drawer is closed */}
      <IconButton
        onClick={toggleDrawer}
        aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
        sx={{
          display: isDrawerOpen ? 'none' : 'flex', // Only hide when drawer is open
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: theme.zIndex.drawer + 2,
          color: theme.palette.common.white,
          backgroundColor: theme.palette.primary.main,
          boxShadow: '0 3px 14px rgba(0,0,0,0.2)',
          width: 48,
          height: 48,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <FiMenu size={22} />
      </IconButton>

      <Drawer
        elevation={6}
        variant={isLargeScreen ? 'persistent' : 'temporary'}
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            paddingTop: '0',
            paddingBottom: '0',
            backgroundColor: theme.palette.background.paper,
            boxShadow: isLargeScreen
              ? '0 0 10px rgba(0,0,0,0.05)'
              : '0 0 20px rgba(0,0,0,0.1)',
            border: 'none',
            overflowX: 'hidden',
            transition: 'transform 0.3s ease-in-out',
            transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            borderRadius: '0',
          },
          // Remove backdrop overlay
          '& .MuiBackdrop-root': {
            backgroundColor: 'transparent',
          },
        }}
        transitionDuration={300}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '0',
            position: 'relative',
          }}
        >
          {/* Header with close button */}
          <Box
            sx={{
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              position: 'relative',
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: theme.palette.primary.main || '#f39c12',
                letterSpacing: '0.5px',
              }}
            >
              Invitations
            </Typography>

            {/* Close button inside header */}
            <IconButton
              onClick={toggleDrawer}
              aria-label="Close sidebar"
              sx={{
                color: theme.palette.text.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <FiX size={20} />
            </IconButton>
          </Box>

          {/* Navigation items with scroll */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.primary.main, 0.2),
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: alpha(theme.palette.primary.main, 0.4),
              },
            }}
          >
            <Box sx={{ py: 2 }}>
              {NavigationItems.map((item, index) => (
                <Box key={index}>
                  <NavButton item={item} />
                  {item.subItems && (
                    <Collapse
                      in={expandedButton === item.name}
                      timeout={300}
                      unmountOnExit
                    >
                      <Box>
                        {item.subItems.map((subItem, subIndex) => (
                          <NavButton
                            key={subIndex}
                            item={subItem}
                            isSubItem={true}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Logout button */}
          <Box
            sx={{
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <NavButton
              item={{
                name: 'Log out',
                link: '/coolboi69/invitation/login',
              }}
              sx={{
                py: 3,
                '&:hover': {
                  color: theme.palette.error.main,
                },
              }}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Main content area - adjust margin based on drawer state */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isLargeScreen && isDrawerOpen ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s ease-in-out',
        }}
      >
        {/* Content goes here */}
      </Box>
    </>
  );
};

export default InvitationsSidebar;
