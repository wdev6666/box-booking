import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bookingService from '../../services/bookingService';
import propertyService from '../../services/propertyService';
import LoadingSpinner from '../common/LoadingSpinner';

const BookingForm = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPropertyDetails();
    }, [propertyId]);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedDate]);

    const fetchPropertyDetails = async () => {
        try {
            const data = await propertyService.getPropertyDetails(propertyId);
            setProperty(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAvailableSlots(
                propertyId,
                selectedDate.toISOString().split('T')[0]
            );
            setAvailableSlots(data.slots);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            const response = await bookingService.createBooking(
                propertyId,
                selectedSlot,
                {
                    specialRequests: event.target.specialRequests.value
                }
            );

            // Navigate to payment or confirmation page
            navigate(`/bookings/${response.booking.id}/payment`, {
                state: { booking: response.booking }
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !property) return <LoadingSpinner />;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Book {property?.name}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Select Date"
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={new Date()}
                                    disablePast
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Select Time Slot</InputLabel>
                                <Select
                                    value={selectedSlot}
                                    onChange={(e) => setSelectedSlot(e.target.value)}
                                    label="Select Time Slot"
                                >
                                    {availableSlots.map((slot) => (
                                        <MenuItem key={slot.id} value={slot.id}>
                                            {new Date(slot.start_time).toLocaleTimeString()} -{' '}
                                            {new Date(slot.end_time).toLocaleTimeString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="specialRequests"
                                label="Special Requests"
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                    Total: ₹{property?.hourly_rate || 0}
                                </Typography>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={!selectedSlot || loading}
                                >
                                    {loading ? 'Processing...' : 'Proceed to Payment'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default BookingForm; 