const supabase = require('../config/supabase');

const createAvailabilitySlot = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { startTime, endTime, priceOverride } = req.body;

        // Verify property ownership
        const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('provider_id')
            .eq('id', propertyId)
            .single();

        if (propertyError || property.provider_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to manage this property' });
        }

        // Create availability slot
        const { data: slot, error } = await supabase
            .from('availability_slots')
            .insert([
                {
                    property_id: propertyId,
                    start_time: startTime,
                    end_time: endTime,
                    price_override: priceOverride,
                    status: 'available'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Availability slot created successfully',
            slot
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPropertyAvailability = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { startDate, endDate } = req.query;

        let query = supabase
            .from('availability_slots')
            .select('*')
            .eq('property_id', propertyId)
            .order('start_time', { ascending: true });

        if (startDate) {
            query = query.gte('start_time', startDate);
        }
        if (endDate) {
            query = query.lte('end_time', endDate);
        }

        const { data: slots, error } = await query;

        if (error) throw error;

        res.json({
            slots
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAvailabilitySlot = async (req, res) => {
    try {
        const { propertyId, slotId } = req.params;
        const { status, priceOverride } = req.body;

        // Verify property ownership
        const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('provider_id')
            .eq('id', propertyId)
            .single();

        if (propertyError || property.provider_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to manage this property' });
        }

        // Update slot
        const { data: slot, error } = await supabase
            .from('availability_slots')
            .update({
                status,
                price_override: priceOverride,
                updated_at: new Date().toISOString()
            })
            .eq('id', slotId)
            .eq('property_id', propertyId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Availability slot updated successfully',
            slot
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createRecurringAvailability = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { 
            startDate, 
            endDate, 
            dailyStartTime, 
            dailyEndTime, 
            daysOfWeek, // Array of days [0-6] where 0 is Sunday
            priceOverride 
        } = req.body;

        // Verify property ownership
        const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('provider_id')
            .eq('id', propertyId)
            .single();

        if (propertyError || property.provider_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to manage this property' });
        }

        const slots = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Generate slots for each day in the range
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            if (daysOfWeek.includes(date.getDay())) {
                const slotStart = new Date(`${date.toISOString().split('T')[0]}T${dailyStartTime}`);
                const slotEnd = new Date(`${date.toISOString().split('T')[0]}T${dailyEndTime}`);

                slots.push({
                    property_id: propertyId,
                    start_time: slotStart.toISOString(),
                    end_time: slotEnd.toISOString(),
                    price_override: priceOverride,
                    status: 'available'
                });
            }
        }

        // Insert all slots
        const { data: createdSlots, error } = await supabase
            .from('availability_slots')
            .insert(slots)
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Recurring availability slots created successfully',
            slots: createdSlots
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCalendarView = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { year, month } = req.query;

        // Validate year and month
        const startDate = new Date(year, month - 1, 1); // month is 0-based
        const endDate = new Date(year, month, 0); // Get last day of month

        // Get all slots for the month
        const { data: slots, error } = await supabase
            .from('availability_slots')
            .select(`
                id,
                start_time,
                end_time,
                status,
                price_override,
                bookings (
                    id,
                    user_id,
                    status
                )
            `)
            .eq('property_id', propertyId)
            .gte('start_time', startDate.toISOString())
            .lte('end_time', endDate.toISOString())
            .order('start_time', { ascending: true });

        if (error) throw error;

        // Get property default price for reference
        const { data: property } = await supabase
            .from('properties')
            .select('hourly_rate')
            .eq('id', propertyId)
            .single();

        // Organize slots by date
        const calendar = {};
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            calendar[dateStr] = {
                date: dateStr,
                slots: [],
                isFullyBooked: false,
                hasAvailability: false
            };
        }

        // Populate calendar with slots
        slots.forEach(slot => {
            const dateStr = new Date(slot.start_time).toISOString().split('T')[0];
            if (calendar[dateStr]) {
                calendar[dateStr].slots.push({
                    id: slot.id,
                    startTime: slot.start_time,
                    endTime: slot.end_time,
                    status: slot.status,
                    price: slot.price_override || property.hourly_rate,
                    isBooked: slot.bookings?.some(b => b.status === 'confirmed')
                });

                // Update availability flags
                if (slot.status === 'available' && !slot.bookings?.some(b => b.status === 'confirmed')) {
                    calendar[dateStr].hasAvailability = true;
                }
            }
        });

        // Update fully booked status
        Object.keys(calendar).forEach(date => {
            const daySlots = calendar[date].slots;
            if (daySlots.length > 0) {
                calendar[date].isFullyBooked = !daySlots.some(slot => 
                    slot.status === 'available' && !slot.isBooked
                );
            }
        });

        res.json({
            propertyId,
            year,
            month,
            calendar: Object.values(calendar)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAvailabilitySlot,
    getPropertyAvailability,
    updateAvailabilitySlot,
    createRecurringAvailability,
    getCalendarView
}; 