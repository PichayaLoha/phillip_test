
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../database/database');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if token is blacklisted
    const [blacklisted] = await db.query('SELECT * FROM blacklisted_tokens WHERE jti = ?', [jwt.decode(token).jti]);
    if (blacklisted.length > 0) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
