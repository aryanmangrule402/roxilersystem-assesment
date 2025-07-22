// backend/routes/adminRoutes.js
const express = require('express');
const { protect } = require('../middleware/authmiddleware'); // Assuming you renamed it to authmiddleware.js
const { authorize } = require('../middleware/rolemiddle'); // This is where 'authorize' is defined
const { // ... (rest of your imports from adminController)
  getAdminDashboardStats,
  addStore,
  addUser,
  getAllUsers,
  getAllStores,
} = require('../controllers/adminController');
const { validate, userSchema, storeSchema } = require('../utils/val'); // Assuming you renamed validation.js to val.js

const router = express.Router();

// Apply protect and authorize middleware to all admin routes
// The original setup was to use router.use() for all admin routes requiring admin role
router.use(protect, authorize('system_admin')); // This applies to ALL routes defined AFTER this line in adminRoutes.js

// Example for adding a new user:
router.post('/users', validate(userSchema), addUser); // No need for separate authenticateToken or restrictTo as router.use already handles it

// Example for adding a new store:
router.post('/stores', validate(storeSchema), addStore);

// Example for getting all users:
router.get('/users', getAllUsers);

// Example for getting all stores:
router.get('/stores', getAllStores);

// Example for dashboard stats:
router.get('/dashboard-stats', getAdminDashboardStats);


module.exports = router;