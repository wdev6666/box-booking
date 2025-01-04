const supabase = require('../config/supabase');
const path = require('path');

const createProperty = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { name, description, location, hourlyRate, amenities } = req.body;
        const photos = req.files;

        // Validate provider role
        if (req.user.user_metadata.role !== 'Provider') {
            return res.status(403).json({ error: 'Only providers can create properties' });
        }

        // Upload photos
        const photoUrls = [];
        if (photos && photos.length > 0) {
            for (const photo of photos) {
                const fileExt = path.extname(photo.originalname);
                const fileName = `${providerId}-${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-photos')
                    .upload(fileName, photo.buffer, {
                        contentType: photo.mimetype,
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('property-photos')
                    .getPublicUrl(fileName);

                photoUrls.push(publicUrl);
            }
        }

        console.log("providerId", providerId);

        // Create property record
        const { data: property, error } = await supabase
            .from('properties')
            .insert([
                {
                    provider_id: providerId,
                    name,
                    description,
                    location,
                    hourly_rate: hourlyRate,
                    amenities,
                    photos: photoUrls,
                    status: 'active'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Property created successfully',
            property
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProviderProperties = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('properties')
            .select('*', { count: 'exact' })
            .eq('provider_id', providerId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Add status filter if provided
        if (status) {
            query = query.eq('status', status);
        }

        const { data: properties, error, count } = await query;

        if (error) throw error;

        res.json({
            properties,
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

const updateProperty = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { propertyId } = req.params;
        const { name, description, location, hourlyRate, amenities, status } = req.body;

        // Check if property exists and belongs to provider
        const { data: existingProperty, error: fetchError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .eq('provider_id', providerId)
            .single();

        if (fetchError || !existingProperty) {
            return res.status(404).json({ error: 'Property not found or unauthorized' });
        }

        // Update property
        const { data: property, error: updateError } = await supabase
            .from('properties')
            .update({
                name,
                description,
                location,
                hourly_rate: hourlyRate,
                amenities,
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', propertyId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            message: 'Property updated successfully',
            property
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchProperties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            minRate,
            maxRate,
            city,
            status = 'active'
        } = req.query;
        const offset = (page - 1) * limit;

        // Build base query with proper join
        let query = supabase
    .from('properties')
    .select(`
        *,
        provider:profiles!fk_provider_profile (
            id,
            name,
            email
        )
    `, { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false });


        // Apply filters
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        if (minRate) {
            query = query.gte('hourly_rate', minRate);
        }

        if (maxRate) {
            query = query.lte('hourly_rate', maxRate);
        }

        if (city) {
            query = query.contains('location', { city: city });
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data: properties, error, count } = await query;

        if (error) {
            console.error('Search error:', error);
            throw error;
        }

        res.json({
            properties,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProperty,
    getProviderProperties,
    updateProperty,
    searchProperties
}; 