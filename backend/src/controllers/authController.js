const supabase = require('../config/supabase');

const register = async (req, res) => {
    console.log("req", req)
    try {
        const { name, email, password, role } = req.body;

        if (!['Provider', 'User'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Register user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    email,
                    role
                }
            }
        });

        if (authError) {
            console.error('SignUp Error:', authError);
            return res.status(400).json({ error: authError.message });
        }

        // Use upsert to prevent duplicate profile entries
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert([  // Change insert to upsert
                {
                    id: authData?.user?.id,
                    name,
                    email,
                    role
                }
            ], { onConflict: ['id'] }); // Ensures conflict on 'id' will update the record, not insert a new one.

            if (profileError) {
                console.error('Profile Upsert Error:', profileError);
                return res.status(400).json({ error: profileError.message });
            }


        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            user: authData.user
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        res.json({
            token: data.session.access_token,
            user: data.user
        });

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });

        if (error) throw error;

        res.json({ message: 'Password reset email sent successfully' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { new_password } = req.body;

        const { error } = await supabase.auth.updateUser({
            password: new_password
        });

        if (error) throw error;

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    requestPasswordReset,
    updatePassword
}; 