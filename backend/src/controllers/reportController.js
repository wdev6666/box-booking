const supabase = require('../config/supabase');
const ExportService = require('../services/exportService');

const getProviderReports = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { startDate, endDate, format } = req.query;

        // Get all properties with their bookings
        const { data: properties, error: propertyError } = await supabase
            .from('properties')
            .select(`
                id,
                name,
                location,
                bookings:bookings(
                    id,
                    booking_price,
                    payment_status,
                    slot:availability_slots(
                        start_time,
                        end_time
                    )
                )
            `)
            .eq('provider_id', providerId)
            .eq('bookings.payment_status', 'paid');

        if (propertyError) throw propertyError;

        // Process and format report data
        const reports = properties.map(property => {
            const filteredBookings = property.bookings.filter(booking => {
                const bookingDate = new Date(booking.slot.start_time);
                return (!startDate || bookingDate >= new Date(startDate)) &&
                    (!endDate || bookingDate <= new Date(endDate));
            });

            // Calculate total earnings
            const totalEarnings = filteredBookings.reduce((sum, booking) => 
                sum + parseFloat(booking.booking_price), 0);

            // Group bookings by time slots to find peak hours
            const timeSlots = {};
            filteredBookings.forEach(booking => {
                const hour = new Date(booking.slot.start_time).getHours();
                timeSlots[hour] = (timeSlots[hour] || 0) + 1;
            });

            // Find peak booking times
            const peakHours = Object.entries(timeSlots)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([hour, count]) => ({
                    hour: `${hour}:00`,
                    bookings: count
                }));

            return {
                propertyId: property.id,
                propertyName: property.name,
                location: property.location,
                totalBookings: filteredBookings.length,
                totalEarnings,
                peakBookingHours: peakHours,
                averageBookingsPerDay: filteredBookings.length / 
                    (Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1)
            };
        });

        // Handle export request
        if (format === 'csv') {
            const exportPath = await ExportService.exportToCSV(
                { reports, summary },
                'providerReport'
            );

            res.download(exportPath, `provider-report-${startDate}-to-${endDate}.csv`, (err) => {
                ExportService.cleanup(exportPath);
                if (err) console.error('Download error:', err);
            });
            return;
        }

        res.json({
            reports,
            summary: {
                totalProperties: properties.length,
                totalEarnings: reports.reduce((sum, report) => sum + report.totalEarnings, 0),
                totalBookings: reports.reduce((sum, report) => sum + report.totalBookings, 0)
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPropertyReport = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { propertyId } = req.params;
        const { startDate, endDate, groupBy = 'day', format } = req.query;

        // Verify property ownership
        const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .eq('provider_id', providerId)
            .single();

        if (propertyError || !property) {
            return res.status(403).json({ error: 'Property not found or unauthorized' });
        }

        // Get bookings for the property
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
                id,
                booking_price,
                payment_status,
                created_at,
                slot:availability_slots(
                    start_time,
                    end_time
                )
            `)
            .eq('property_id', propertyId)
            .eq('payment_status', 'paid')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (bookingsError) throw bookingsError;

        // Group data based on specified interval
        const groupedData = {};
        bookings.forEach(booking => {
            let key;
            const date = new Date(booking.created_at);
            
            switch(groupBy) {
                case 'month':
                    key = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    break;
                case 'week':
                    const weekNumber = Math.ceil(date.getDate() / 7);
                    key = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNumber}`;
                    break;
                default: // day
                    key = date.toISOString().split('T')[0];
            }

            if (!groupedData[key]) {
                groupedData[key] = {
                    period: key,
                    bookings: 0,
                    earnings: 0
                };
            }

            groupedData[key].bookings++;
            groupedData[key].earnings += parseFloat(booking.booking_price);
        });

        const reportData = {
            property: {
                id: property.id,
                name: property.name,
                location: property.location
            },
            reportPeriod: {
                start: startDate,
                end: endDate,
                groupBy
            },
            data: Object.values(groupedData),
            summary: {
                totalBookings: bookings.length,
                totalEarnings: bookings.reduce((sum, booking) => 
                    sum + parseFloat(booking.booking_price), 0)
            }
        };

        // Handle export request
        if (format === 'csv') {
            const exportPath = await ExportService.exportToCSV(
                reportData,
                'propertyReport'
            );

            res.download(exportPath, `property-report-${propertyId}-${startDate}-to-${endDate}.csv`, (err) => {
                ExportService.cleanup(exportPath);
                if (err) console.error('Download error:', err);
            });
            return;
        }

        res.json(reportData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProviderReports,
    getPropertyReport
}; 