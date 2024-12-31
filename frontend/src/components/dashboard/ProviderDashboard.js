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
    Add as AddIcon,
    SportsCricket as CricketIcon,
    EventAvailable as EventIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
);

const ProviderDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const dashboardCards = [
        {
            title: 'Add New Ground',
            icon: AddIcon,
            description: 'List a new box cricket facility',
            action: () => navigate('/properties/new')
        },
        {
            title: 'Manage Grounds',
            icon: CricketIcon,
            description: 'View and manage your listed grounds',
            action: () => navigate('/properties/manage')
        },
        {
            title: 'Bookings',
            icon: EventIcon,
            description: 'View and manage bookings',
            action: () => navigate('/bookings')
        },
        {
            title: 'Reports',
            icon: AssessmentIcon,
            description: 'View earnings and analytics',
            action: () => navigate('/reports')
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Properties" />
                <Tab label="Bookings" />
                <Tab label="Reports" />
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

export default ProviderDashboard; 