// backend/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Make sure cors is imported
const { connectDB } = require('./config/db');
const { syncDatabase } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();
// Sync database models
syncDatabase();

// Middleware
app.use(express.json()); // Body parser for JSON

// Configure CORS specifically for your frontend's origin
app.use(cors({
    origin: 'http://localhost:5174', // <--- IMPORTANT: Set your frontend's exact origin here
    credentials: true, // <--- IMPORTANT: Allow sending cookies/credentials
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/store-owner', storeRoutes);
app.use('/api/admin', adminRoutes);

// Custom error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));