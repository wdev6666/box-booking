import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Rating,
    Box,
    Container,
    TextField,
    MenuItem,
    IconButton,
    Chip
} from '@mui/material';
import {
    LocationOn,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import LoadingSpinner from '../common/LoadingSpinner';

const PropertyGrid = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        minRate: '',
        maxRate: '',
        sortBy: 'created_at'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getAllProperties(filters);
            setProperties(data.properties);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            name="city"
                            label="City"
                            value={filters.city}
                            onChange={handleFilterChange}
                            select
                        >
                            <MenuItem value="">All Cities</MenuItem>
                            {/* Add cities dynamically */}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            name="minRate"
                            label="Min Rate"
                            type="number"
                            value={filters.minRate}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            name="maxRate"
                            label="Max Rate"
                            type="number"
                            value={filters.maxRate}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            name="sortBy"
                            label="Sort By"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            select
                        >
                            <MenuItem value="created_at">Newest First</MenuItem>
                            <MenuItem value="hourly_rate">Price: Low to High</MenuItem>
                            <MenuItem value="-hourly_rate">Price: High to Low</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {/* Property Grid */}
            <Grid container spacing={3}>
                {properties.map((property) => (
                    <Grid item xs={12} sm={6} md={4} key={property.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={property.photos[0] || '/placeholder.jpg'}
                                alt={property.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {property.name}
                                </Typography>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {property.location.city}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Rating 
                                        value={property.averageRating || 0} 
                                        readOnly 
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary" ml={1}>
                                        ({property.totalReviews || 0} reviews)
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="primary">
                                    ₹{property.hourly_rate}/hour
                                </Typography>
                                <Box mt={1}>
                                    {property.amenities?.slice(0, 3).map((amenity, index) => (
                                        <Chip
                                            key={index}
                                            label={amenity}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    fullWidth 
                                    variant="contained"
                                    onClick={() => navigate(`/properties/${property.id}`)}
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PropertyGrid; 