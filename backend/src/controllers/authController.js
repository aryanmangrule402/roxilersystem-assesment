// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, address, role } = req.body; // <--- Ensure 'role' is destructured

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // IMPORTANT: Allow all three roles for self-registration as per your requirement
    // This is less secure for production, but directly addresses your request.
    const allowedSelfRegisterRoles = ['normal_user', 'store_owner', 'system_admin'];
    
    let assignedRole = 'normal_user'; // Default if no valid role is provided

    if (role && allowedSelfRegisterRoles.includes(role)) {
        assignedRole = role;
    }
    // If an invalid role is provided, it will default to 'normal_user'.

    const user = await User.create({
        name,
        email,
        password,
        address,
        role: assignedRole, // <--- Use the determined assignedRole
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role, // This will now correctly reflect the assignedRole
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ where: { email } });

    if (!user) {
        console.log('Login failed: User not found for email:', email);
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result for', email, ':', isMatch);

    if (isMatch) {
        console.log('Login successful for user:', user.email);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // This sends the actual role from the DB
            token: generateToken(user.id),
        });
    } else {
        console.log('Login failed: Incorrect password for user:', email);
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Update user password
// @route   PUT /api/auth/profile/password
// @access  Private (Normal User, Store Owner, Admin)
const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!(await user.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
});

module.exports = {
    registerUser,
    loginUser,
    updatePassword,
};