// backend/src/config/jwt.js
module.exports = {
    secret: process.env.JWT_SECRET || 'a_very_secret_key', // Use a strong, random key in production
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};