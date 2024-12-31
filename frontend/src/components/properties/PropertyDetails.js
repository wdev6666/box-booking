import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    Typography,
    Box,
    Button,
    Rating,
    Divider,
    Chip,
    ImageList,
    ImageListItem,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar
} from '@mui/material';
import {
    LocationOn,
    AccessTime,
    SportsCricket,
    LocalParking,
    WaterDrop,
    Comment
} from '@mui/icons-material';
import propertyService from '../../services/propertyService';
import LoadingSpinner from '../common/LoadingSpinner';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getPropertyDetails(id);
            setProperty(data);
        } catch (error) {
            console.error('Error fetching property details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!property) return <Typography>Property not found</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    {/* Property Images */}
                    <Card sx={{ mb: 3 }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={property.photos[0] || '/placeholder.jpg'}
                            alt={property.name}
                        />
                        <Box sx={{ p: 2 }}>
                            <ImageList cols={4} rowHeight={100} gap={8}>
                                {property.photos.slice(1).map((photo, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={photo}
                                            alt={`View ${index + 2}`}
                                            loading="lazy"
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Card>

                    {/* Property Details */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {property.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                            <LocationOn color="action" />
                            <Typography variant="body1" color="text.secondary" ml={1}>
                                {`${property.location.address}, ${property.location.city}`}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Rating value={property.averageRating || 0} readOnly />
                            <Typography variant="body2" color="text.secondary" ml={1}>
                                ({property.totalReviews} reviews)
                            </Typography>
                        </Box>
                        <Typography variant="h5" color="primary" gutterBottom>
                            ₹{property.hourly_rate}/hour
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {property.description}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Amenities
                        </Typography>
                        <Box mb={2}>
                            {property.amenities?.map((amenity, index) => (
                                <Chip
                                    key={index}
                                    label={amenity}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                    </Paper>

                    {/* Reviews Section */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Reviews
                        </Typography>
                        <List>
                            {property.reviews?.map((review, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Avatar>{review.user.name[0]}</Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    <Typography component="span" variant="subtitle1">
                                                        {review.user.name}
                                                    </Typography>
                                                    <Rating
                                                        value={review.rating}
                                                        size="small"
                                                        readOnly
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {review.comment}
                                                    </Typography>
                                                    <br />
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < property.reviews.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Booking Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Book this ground
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={() => navigate(`/properties/${id}/book`)}
                            sx={{ mt: 2 }}
                        >
                            Check Availability
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PropertyDetails; 