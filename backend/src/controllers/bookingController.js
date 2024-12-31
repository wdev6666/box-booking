const supabase = require('../config/supabase');
const emailService = require('../services/emailService');
const paymentService = require('../services/paymentService');

const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { propertyId, slotId } = req.params;
        const { specialRequests } = req.body;

        // Start a transaction
        const { data: slot, error: slotError } = await supabase
            .from('availability_slots')
            .select('*')
            .eq('id', slotId)
            .eq('property_id', propertyId)
            .eq('status', 'available')
            .single();

        if (slotError || !slot) {
            return res.status(400).json({ error: 'Slot not available' });
        }

        // Check if slot is already booked
        const { data: existingBooking, error: bookingCheckError } = await supabase
            .from('bookings')
            .select('id')
            .eq('slot_id', slotId)
            .eq('status', 'confirmed')
            .single();

        if (existingBooking) {
            return res.status(400).json({ error: 'Slot already booked' });
        }

        // Create payment intent first
        const paymentIntent = await paymentService.createPaymentIntent(
            booking.id,
            slot.price_override || slot.default_price
        );

        // Create booking with pending payment status
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([
                {
                    user_id: userId,
                    property_id: propertyId,
                    slot_id: slotId,
                    booking_price: slot.price_override || slot.default_price,
                    special_requests: specialRequests,
                    status: 'pending',
                    payment_status: 'pending',
                    payment_intent_id: paymentIntent.id
                }
            ])
            .select()
            .single();

        if (bookingError) throw bookingError;

        res.status(201).json({
            message: 'Booking created successfully',
            booking,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('bookings')
            .select(`
                *,
                property:properties (
                    id,
                    name,
                    location
                ),
                slot:availability_slots (
                    start_time,
                    end_time,
                    price_override
                )
            `, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data: bookings, error, count } = await query;

        if (error) throw error;

        res.json({
            bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const confirmBookingPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { paymentIntentId } = req.body;

        // Confirm payment and update booking
        const booking = await paymentService.confirmPayment(bookingId, paymentIntentId);

        // Get additional details for email
        const { data: { user, property, slot } } = await supabase
            .from('bookings')
            .select(`
                *,
                user:profiles!bookings_user_id_fkey(*),
                property:properties(*),
                slot:availability_slots(*)
            `)
            .eq('id', bookingId)
            .single();

        // Update slot status
        await supabase
            .from('availability_slots')
            .update({ status: 'booked' })
            .eq('id', booking.slot_id);

        // Send confirmation email
        await emailService.sendBookingConfirmation(booking, user, property, slot);

        res.json({
            message: 'Payment confirmed and booking completed',
            booking
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        // Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .eq('user_id', userId)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Process refund if payment was made
        if (booking.payment_status === 'paid') {
            await paymentService.handleRefund(bookingId);
        }

        // Update booking status
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ 
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

        if (updateError) throw updateError;

        // Update slot status back to available
        const { error: slotError } = await supabase
            .from('availability_slots')
            .update({ 
                status: 'available',
                updated_at: new Date().toISOString()
            })
            .eq('id', booking.slot_id);

        if (slotError) throw slotError;

        // Send cancellation email
        const { data: { user, property } } = await supabase
            .from('bookings')
            .select(`
                *,
                user:profiles!bookings_user_id_fkey(*),
                property:properties(*)
            `)
            .eq('id', bookingId)
            .single();

        await emailService.sendBookingCancellation(booking, user, property);

        res.json({
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    confirmBookingPayment
}; 