const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReceiptService {
    static async generateReceipt(booking, user, property, slot) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const fileName = `receipt-${booking.id}.pdf`;
                const filePath = path.join(__dirname, '../../temp', fileName);

                // Ensure temp directory exists
                if (!fs.existsSync(path.join(__dirname, '../../temp'))) {
                    fs.mkdirSync(path.join(__dirname, '../../temp'));
                }

                // Pipe PDF to file
                doc.pipe(fs.createWriteStream(filePath));

                // Add content to PDF
                doc
                    .fontSize(20)
                    .text('Box Cricket Ground - Payment Receipt', { align: 'center' })
                    .moveDown();

                doc
                    .fontSize(12)
                    .text(`Receipt No: ${booking.id}`)
                    .text(`Date: ${new Date().toLocaleDateString()}`)
                    .moveDown();

                doc
                    .text('Customer Details:')
                    .text(`Name: ${user.name}`)
                    .text(`Email: ${user.email}`)
                    .moveDown();

                doc
                    .text('Booking Details:')
                    .text(`Ground: ${property.name}`)
                    .text(`Date: ${new Date(slot.start_time).toLocaleDateString()}`)
                    .text(`Time: ${new Date(slot.start_time).toLocaleTimeString()} - ${new Date(slot.end_time).toLocaleTimeString()}`)
                    .moveDown();

                doc
                    .text('Payment Details:')
                    .text(`Amount: ₹${booking.booking_price}`)
                    .text(`Payment Status: ${booking.payment_status}`)
                    .text(`Payment ID: ${booking.payment_intent_id}`)
                    .moveDown();

                doc.end();

                // Return file path
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async cleanupReceipt(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Error cleaning up receipt:', error);
        }
    }
}

module.exports = ReceiptService; 