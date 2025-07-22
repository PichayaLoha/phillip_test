const db = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid'); // เพิ่มบรรทัดนี้
exports.register = async (req, res) => {
  const { username, password } = req.body;
  const createDate = new Date();
  try {
    const [registerUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (registerUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query('INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)', [username, hashedPassword, createDate]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error');
  }
};
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const jti = uuidv4(); // สร้าง jti
        const token = jwt.sign({ id: user.id, username: user.username, jti: jti }, config.jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // ดึง token ออกมา (Bearer <token>)

    try {
        const decoded = jwt.verify(token, config.jwtSecret); // ใช้ config.jwtSecret
        const { jti, exp } = decoded; // ดึง jti และ exp

        if (!jti) {
            return res.status(400).json({ message: 'JWT ID (jti) not found in token. Cannot blacklist.' });
        }

        const expiresAt = new Date(exp * 1000); // Convert Unix timestamp to Date object

        // บันทึก jti ลงใน blacklisted_tokens
        await db.query(
            'INSERT INTO blacklisted_tokens (jti, expires_at) VALUES (?, ?)',
            [jti, expiresAt]
        );

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token already expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Error during logout:', error);
        res.status(500).send('Server error');
    }
};
