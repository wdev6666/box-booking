import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onMenuClick={toggleSidebar} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${240}px)` },
                    mt: '64px', // Height of navbar
                    minHeight: 'calc(100vh - 64px)'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout; 