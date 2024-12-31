const supabase = require('../config/supabase');
const emailService = require('./emailService');

class PaymentTrackingService {
    static async trackPaymentStatus() {
        try {
            // Find pending payments older than 30 minutes
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            const { data: expiredBookings, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    user:profiles!bookings_user_id_fkey(*),
                    property:properties(*),
                    slot:availability_slots(*)
                `)
                .eq('payment_status', 'pending')
                .lt('created_at', thirtyMinutesAgo.toISOString());

            if (error) throw error;

            // Process expired bookings
            for (const booking of expiredBookings) {
                await this.handleExpiredBooking(booking);
            }

        } catch (error) {
            console.error('Payment tracking error:', error);
        }
    }

    static async handleExpiredBooking(booking) {
        try {
            // Update booking status
            const { error: updateError } = await supabase
                .from('bookings')
                .update({
                    status: 'expired',
                    payment_status: 'expired',
                    updated_at: new Date().toISOString()
                })
                .eq('id', booking.id);

            if (updateError) throw updateError;

            // Release the slot
            await supabase
                .from('availability_slots')
                .update({
                    status: 'available',
                    updated_at: new Date().toISOString()
                })
                .eq('id', booking.slot.id);

            // Notify user
            await emailService.sendBookingExpiration(booking, booking.user, booking.property);

        } catch (error) {
            console.error('Error handling expired booking:', error);
        }
    }
}

module.exports = PaymentTrackingService; 