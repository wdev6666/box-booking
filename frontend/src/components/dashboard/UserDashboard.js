import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import {
    Search as SearchIcon,
    History as HistoryIcon,
    RateReview as ReviewIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
);

const UserDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const dashboardCards = [
        {
            title: 'Find Grounds',
            icon: SearchIcon,
            description: 'Search and book cricket grounds',
            action: () => navigate('/properties')
        },
        {
            title: 'My Bookings',
            icon: HistoryIcon,
            description: 'View your booking history',
            action: () => navigate('/my-bookings')
        },
        {
            title: 'My Reviews',
            icon: ReviewIcon,
            description: 'Manage your reviews',
            action: () => navigate('/my-reviews')
        },
        {
            title: 'Profile',
            icon: PersonIcon,
            description: 'Update your profile',
            action: () => navigate('/profile')
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="My Bookings" />
                <Tab label="Reviews" />
                <Tab label="Profile" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {dashboardCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <card.icon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small" 
                                        onClick={card.action}
                                        fullWidth
                                    >
                                        View
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Add content for other tabs */}
        </Box>
    );
};

export default UserDashboard; 