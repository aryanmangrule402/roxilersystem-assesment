// backend/src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const generateToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        return null; // Token is invalid or expired
    }
};

module.exports = { generateToken, verifyToken };