import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Collapse,
  Popover,
  Badge,
  Avatar,
  Paper,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [infoAnchor, setInfoAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data - replace with actual data from your API/context
  const notifications = [
    { id: 1, message: 'New company added', time: '2 hours ago' },
    { id: 2, message: 'Company details updated', time: '5 hours ago' },
    { id: 3, message: 'System maintenance scheduled', time: '1 day ago' },
  ];

  const companyDetails = {
    name: 'Company Master System',
    version: '1.0.0',
    description: 'Master Management System for company data',
  };

  const userDetails = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMasterMenuToggle = () => {
    setMasterMenuOpen(!masterMenuOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleInfoClick = (event) => {
    setInfoAnchor(event.currentTarget);
  };

  const handleInfoClose = () => {
    setInfoAnchor(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const notificationOpen = Boolean(notificationAnchor);
  const infoOpen = Boolean(infoAnchor);
  const profileOpen = Boolean(profileAnchor);

  const masterSubMenuItems = [
    {
      text: 'Company Master',
      icon: <BusinessIcon />,
      path: '/company',
    },
  ];

  const currentDrawerWidth = sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

  const drawer = (
    <div>
      <Toolbar
        onClick={handleSidebarToggle}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {!sidebarCollapsed && (
          <Typography variant="h6" noWrap component="div">
            Company Master
          </Typography>
        )}
        <IconButton
          size="small"
          sx={{ ml: sidebarCollapsed ? 0 : 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            handleSidebarToggle();
          }}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/' || location.pathname === '/dashboard'}
            onClick={() => {
              navigate('/dashboard');
              setMobileOpen(false);
            }}
            sx={{
              minHeight: 48,
              justifyContent: sidebarCollapsed ? 'center' : 'initial',
              px: 2.5,
            }}
            title={sidebarCollapsed ? 'Dashboard' : ''}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                mr: sidebarCollapsed ? 0 : 3,
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleMasterMenuToggle}
            sx={{
              minHeight: 48,
              justifyContent: sidebarCollapsed ? 'center' : 'initial',
              px: 2.5,
            }}
            title={sidebarCollapsed ? 'Master' : ''}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                mr: sidebarCollapsed ? 0 : 3,
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Master" />}
            {!sidebarCollapsed && (masterMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={masterMenuOpen && !sidebarCollapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {masterSubMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname.startsWith(item.path)}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
                  <Typography variant="body2" sx={{ flexGrow: 1, opacity: 0.9, fontSize: '1.5rem' }}>
            Manage Company Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notification Icon */}
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              aria-label="notifications"
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Info Icon */}
            <IconButton
              color="inherit"
              onClick={handleInfoClick}
              aria-label="company information"
            >
              <InfoIcon />
            </IconButton>

            {/* User Profile Icon */}
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              aria-label="user profile"
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Popover */}
      <Popover
        open={notificationOpen}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Popover>

      {/* Company Info Popover */}
      <Popover
        open={infoOpen}
        anchorEl={infoAnchor}
        onClose={handleInfoClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Company Details</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {companyDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Version: {companyDetails.version}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {companyDetails.description}
            </Typography>
          </Box>
        </Paper>
      </Popover>

      {/* User Profile Popover */}
      <Popover
        open={profileOpen}
        anchorEl={profileAnchor}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">User Profile</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {userDetails.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {userDetails.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userDetails.role}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Email:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userDetails.email}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Popover>

      <Box
        component="nav"
        sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              transition: (theme) =>
                theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
