// backend/routes/userRoutes.js
const express = require('express'); // Make sure this line is present
const { protect } = require('../middleware/authmiddleware'); // Corrected path to specific file (assuming you renamed it)
const { authorize } = require('../middleware/rolemiddle'); // Corrected path to specific file
const { getAllStoresForUser, submitOrModifyRating } = require('../controllers/userController');
const { validate, ratingSchema } = require('../utils/val'); // Corrected path to specific file (assuming you renamed it)

const router = express.Router();

// All normal user routes require authentication and normal_user role
router.use(protect, authorize('normal_user'));

router.get('/stores', getAllStoresForUser);
router.post('/stores/:storeId/ratings', validate(ratingSchema), submitOrModifyRating);

module.exports = router;