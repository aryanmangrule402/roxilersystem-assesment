// backend/routes/storeRoutes.js
const express = require('express'); // Make sure this line is present
const { protect } = require('../middleware/authmiddleware'); // Corrected path to specific file
const { authorize } = require('../middleware/rolemiddle'); // Corrected path to specific file
const { getStoreOwnerDashboard } = require('../controllers/storeController');

const router = express.Router();

// All store owner routes require authentication and store_owner role
router.use(protect, authorize('store_owner'));

router.get('/dashboard', getStoreOwnerDashboard);

module.exports = router;