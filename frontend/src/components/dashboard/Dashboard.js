import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Typography, Paper } from '@mui/material';
import { selectCurrentUser } from '../../store/slices/authSlice';
import ProviderDashboard from './ProviderDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    const role = user?.user_metadata?.role;

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome, {user?.user_metadata?.name}!
                    </Typography>
                    {role === 'Provider' ? <ProviderDashboard /> : <UserDashboard />}
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard; 