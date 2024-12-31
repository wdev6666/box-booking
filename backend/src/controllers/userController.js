const supabase = require('../config/supabase');
const path = require('path');

const getUserDashboard = async (req, res) => {
    try {
        const userRole = req.user.user_metadata.role;
        let dashboardData = {
            user: {
                name: req.user.user_metadata.name,
                email: req.user.email,
                role: userRole
            }
        };

        // Role-specific data
        if (userRole === 'Provider') {
            dashboardData = {
                ...dashboardData,
                features: [
                    'Manage Box Cricket Grounds',
                    'View Bookings',
                    'Set Availability',
                    'Manage Pricing',
                    'View Analytics'
                ],
                accessLevel: 'provider'
            };
        } else if (userRole === 'User') {
            dashboardData = {
                ...dashboardData,
                features: [
                    'Browse Grounds',
                    'Make Bookings',
                    'View Booking History',
                    'Rate and Review'
                ],
                accessLevel: 'user'
            };
        }

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, location, phone } = req.body;

        // Update profile data
        const { data: profile, error: updateError } = await supabase
            .from('profiles')
            .update({
                name,
                location,
                phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const avatarFile = req.file;

        if (!avatarFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique filename
        const fileExt = path.extname(avatarFile.originalname);
        const fileName = `${userId}-${Date.now()}${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, avatarFile.buffer, {
                contentType: avatarFile.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Update profile with new avatar URL
        const { data: profile, error: updateError } = await supabase
            .from('profiles')
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            message: 'Avatar uploaded successfully',
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.user.user_metadata;

        // Create initial profile
        const { data: profile, error: createError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: userId,
                    name,
                    email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (createError) throw createError;

        res.json({
            message: 'Profile created successfully',
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserDashboard,
    getProfile,
    updateProfile,
    uploadAvatar,
    createProfile
}; 