const jwt = require('jsonwebtoken');
const db = require('../database/database'); // Import db connection
const config = require('../config/config');

module.exports = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    try {
        // Verify token first to get decoded payload including jti
        const decoded = jwt.verify(token, config.jwtSecret);

        // Check if token's jti is blacklisted
        const [blacklistedJti] = await db.query('SELECT * FROM blacklisted_tokens WHERE jti = ?', [decoded.jti]);
        if (blacklistedJti.length > 0) {
            return res.status(401).json({ message: 'Token is blacklisted, authorization denied' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Auth middleware error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};