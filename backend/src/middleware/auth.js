const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.user_metadata || !req.user.user_metadata.role) {
            return res.status(403).json({ error: 'Role not found in user data' });
        }

        const userRole = req.user.user_metadata.role;
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                error: 'Access forbidden',
                message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = { authenticateToken, authorize }; 