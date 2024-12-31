import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Dashboard,
    SportsCricket,
    EventAvailable,
    Assessment,
    Person,
    Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawerWidth = 240;

    const menuItems = user?.user_metadata?.role === 'Provider' ? [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'My Properties', icon: <SportsCricket />, path: '/properties/manage' },
        { text: 'Bookings', icon: <EventAvailable />, path: '/bookings' },
        { text: 'Reports', icon: <Assessment />, path: '/reports' },
        { text: 'Profile', icon: <Person />, path: '/profile' }
    ] : [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Find Grounds', icon: <Search />, path: '/properties' },
        { text: 'My Bookings', icon: <EventAvailable />, path: '/my-bookings' },
        { text: 'Profile', icon: <Person />, path: '/profile' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) onClose();
    };

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={open}
            onClose={onClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    mt: '64px' // Height of navbar
                }
            }}
        >
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 