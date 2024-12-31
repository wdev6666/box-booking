const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

class ExportService {
    static async exportToCSV(data, type) {
        try {
            // Ensure export directory exists
            const exportDir = path.join(__dirname, '../../temp/exports');
            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filePath = path.join(exportDir, `${type}-${timestamp}.csv`);

            const csvWriter = this.getCsvWriter(type, filePath);
            await csvWriter.writeRecords(this.formatData(data, type));

            return filePath;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }

    static getCsvWriter(type, filePath) {
        const headers = {
            providerReport: [
                { id: 'propertyName', title: 'Property Name' },
                { id: 'location', title: 'Location' },
                { id: 'totalBookings', title: 'Total Bookings' },
                { id: 'totalEarnings', title: 'Total Earnings (₹)' },
                { id: 'averageBookingsPerDay', title: 'Avg. Bookings/Day' },
                { id: 'peakHours', title: 'Peak Hours' }
            ],
            propertyReport: [
                { id: 'period', title: 'Period' },
                { id: 'bookings', title: 'Bookings' },
                { id: 'earnings', title: 'Earnings (₹)' }
            ]
        };

        return createCsvWriter({
            path: filePath,
            header: headers[type]
        });
    }

    static formatData(data, type) {
        switch (type) {
            case 'providerReport':
                return data.reports.map(report => ({
                    propertyName: report.propertyName,
                    location: JSON.stringify(report.location),
                    totalBookings: report.totalBookings,
                    totalEarnings: report.totalEarnings,
                    averageBookingsPerDay: report.averageBookingsPerDay.toFixed(2),
                    peakHours: report.peakBookingHours
                        .map(peak => `${peak.hour} (${peak.bookings} bookings)`)
                        .join(', ')
                }));

            case 'propertyReport':
                return data.data.map(item => ({
                    period: item.period,
                    bookings: item.bookings,
                    earnings: item.earnings
                }));

            default:
                throw new Error('Invalid export type');
        }
    }

    static cleanup(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}

module.exports = ExportService; 