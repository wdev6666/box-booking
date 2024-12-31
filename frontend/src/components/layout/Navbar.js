import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Notifications
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Box Cricket
                </Typography>

                {!user ? (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" sx={{ mr: 2 }}>
                            <Notifications />
                        </IconButton>
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                        >
                            {user.user_metadata?.avatar_url ? (
                                <Avatar 
                                    src={user.user_metadata.avatar_url}
                                    alt={user.user_metadata.name}
                                />
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 