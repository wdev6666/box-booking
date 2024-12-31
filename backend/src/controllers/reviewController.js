const supabase = require('../config/supabase');

const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { propertyId } = req.params;
        const { rating, comment } = req.body;

        // Check if user has already reviewed this property
        const { data: existingReview, error: checkError } = await supabase
            .from('reviews')
            .select('id')
            .eq('property_id', propertyId)
            .eq('user_id', userId)
            .single();

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this property' });
        }

        // Create review
        const { data: review, error } = await supabase
            .from('reviews')
            .insert([
                {
                    property_id: propertyId,
                    user_id: userId,
                    rating,
                    comment
                }
            ])
            .select('*, profiles!reviews_user_id_fkey(name)')
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Review created successfully',
            review
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPropertyReviews = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Get reviews with user details
        const { data: reviews, error, count } = await supabase
            .from('reviews')
            .select('*, profiles!reviews_user_id_fkey(name)', { count: 'exact' })
            .eq('property_id', propertyId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Calculate average rating
        const { data: avgRating } = await supabase
            .from('reviews')
            .select('rating')
            .eq('property_id', propertyId)
            .avg('rating')
            .single();

        res.json({
            reviews,
            averageRating: avgRating?.avg || 0,
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

module.exports = {
    createReview,
    getPropertyReviews
}; 