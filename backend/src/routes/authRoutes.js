// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authmiddleware');
const { validate, userSchema, loginSchema, passwordUpdateSchema } = require('../utils/val'); // <--- Change 'val' to 'validation'

const router = express.Router();

router.post('/register', validate(userSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.put('/profile/password', protect, validate(passwordUpdateSchema), updatePassword);

module.exports = router;