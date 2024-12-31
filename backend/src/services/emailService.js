const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendBookingConfirmation = async (booking, user, property, slot) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Booking Confirmation - Box Cricket Ground',
        html: `
            <h1>Booking Confirmation</h1>
            <p>Dear ${user.name},</p>
            <p>Your booking has been confirmed for ${property.name}.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Date: ${new Date(slot.start_time).toLocaleDateString()}</li>
                <li>Time: ${new Date(slot.start_time).toLocaleTimeString()} - ${new Date(slot.end_time).toLocaleTimeString()}</li>
                <li>Amount: ₹${booking.booking_price}</li>
                <li>Booking ID: ${booking.id}</li>
            </ul>
            <p>Location: ${JSON.stringify(property.location)}</p>
            <p>Thank you for choosing our service!</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendBookingCancellation = async (booking, user, property) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Booking Cancellation - Box Cricket Ground',
        html: `
            <h1>Booking Cancelled</h1>
            <p>Dear ${user.name},</p>
            <p>Your booking for ${property.name} has been cancelled.</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p>If you did not request this cancellation, please contact us immediately.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendBookingExpiration = async (booking, user, property) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Booking Expired - Box Cricket Ground',
        html: `
            <h1>Booking Expired</h1>
            <p>Dear ${user.name},</p>
            <p>Your booking for ${property.name} has expired due to incomplete payment.</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p>Please make a new booking if you still wish to use the facility.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendPaymentReceipt = async (booking, user, property, receiptPath) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Payment Receipt - Box Cricket Ground',
        html: `
            <h1>Payment Receipt</h1>
            <p>Dear ${user.name},</p>
            <p>Thank you for your payment. Please find attached receipt for your booking at ${property.name}.</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Amount Paid:</strong> ₹${booking.booking_price}</p>
        `,
        attachments: [
            {
                filename: `receipt-${booking.id}.pdf`,
                path: receiptPath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendBookingConfirmation,
    sendBookingCancellation,
    sendBookingExpiration,
    sendPaymentReceipt
}; 