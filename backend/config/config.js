require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000, // Default to 3000 if PORT is not set
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'your_database_name',
  },
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  // Add other configurations here as needed
};