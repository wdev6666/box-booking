const supabase = require('../config/supabase');

const listProperties = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12,
            city,
            minRate,
            maxRate,
            sortBy = 'created_at'
        } = req.query;
        
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('properties')
            .select(`
                id,
                name,
                location,
                hourly_rate,
                photos,
                amenities,
                provider:profiles!properties_provider_id_fkey(
                    name
                )
            `, { count: 'exact' })
            .eq('status', 'active')
            .order(sortBy, { ascending: sortBy === 'hourly_rate' });

        // Apply filters
        if (city) {
            query = query.contains('location', { city: city });
        }
        if (minRate) {
            query = query.gte('hourly_rate', minRate);
        }
        if (maxRate) {
            query = query.lte('hourly_rate', maxRate);
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data: properties, error, count } = await query;

        if (error) throw error;

        // Get available cities for filtering
        const { data: cities } = await supabase
            .from('properties')
            .select('location->city')
            .eq('status', 'active')
            .distinct();

        res.json({
            properties,
            filters: {
                cities: cities.map(item => item.city).filter(Boolean)
            },
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

const getPropertyDetails = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const { data: property, error } = await supabase
            .from('properties')
            .select(`
                *,
                provider:profiles!properties_provider_id_fkey(
                    name,
                    email
                ),
                reviews(
                    rating,
                    comment,
                    created_at,
                    user:profiles!reviews_user_id_fkey(
                        name
                    )
                )
            `)
            .eq('id', propertyId)
            .eq('status', 'active')
            .single();

        if (error) throw error;

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Calculate average rating
        const averageRating = property.reviews.length > 0
            ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
            : 0;

        res.json({
            ...property,
            averageRating,
            totalReviews: property.reviews.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listProperties,
    getPropertyDetails
}; 