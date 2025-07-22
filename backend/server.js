// backend/server.js
require('dotenv').config(); // Load environment variables
const app = require('./src/app');
const pool = require('./src/config/database'); // Import database pool

const PORT = process.env.PORT || 5000;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1); // Exit if DB connection fails
    }
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});