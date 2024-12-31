const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/supabase');
const ReceiptService = require('./receiptService');
const emailService = require('./emailService');

const createPaymentIntent = async (bookingId, amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'inr',
        metadata: {
            bookingId
        }
    });

    return paymentIntent;
};

const confirmPayment = async (bookingId, paymentIntentId) => {
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .update({
            payment_status: 'paid',
            payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (bookingError) throw bookingError;

    const { data: bookingDetails } = await supabase
        .from('bookings')
        .select(`
            *,
            user:profiles!bookings_user_id_fkey(*),
            property:properties(*),
            slot:availability_slots(*)
        `)
        .eq('id', bookingId)
        .single();

    const receiptPath = await ReceiptService.generateReceipt(
        bookingDetails,
        bookingDetails.user,
        bookingDetails.property,
        bookingDetails.slot
    );

    await emailService.sendPaymentReceipt(
        bookingDetails,
        bookingDetails.user,
        bookingDetails.property,
        receiptPath
    );

    await ReceiptService.cleanupReceipt(receiptPath);

    return booking;
};

const handleRefund = async (bookingId) => {
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('payment_intent_id')
        .eq('id', bookingId)
        .single();

    if (bookingError) throw bookingError;

    if (booking.payment_intent_id) {
        const refund = await stripe.refunds.create({
            payment_intent: booking.payment_intent_id
        });

        await supabase
            .from('bookings')
            .update({
                payment_status: 'refunded',
                refund_id: refund.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

        return refund;
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    handleRefund
}; 