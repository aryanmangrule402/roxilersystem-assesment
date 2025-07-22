// backend/controllers/storeController.js
const asyncHandler = require('express-async-handler');
const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

// @desc    Get store owner's dashboard data
// @route   GET /api/store-owner/dashboard
// @access  Private (Store Owner)
const getStoreOwnerDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;

  const ownedStores = await Store.findAll({
    where: { ownerId },
    include: [
      {
        model: Rating,
        as: 'storeRatings',
        include: {
          model: User,
          as: 'rater',
          attributes: ['id', 'name', 'email', 'address'],
        },
      },
    ],
  });

  const dashboardData = ownedStores.map(store => {
    const totalRatings = store.storeRatings.length;
    const sumRatings = store.storeRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 'N/A';

    return {
      storeId: store.id,
      storeName: store.name,
      averageRating,
      usersWhoRated: store.storeRatings.map(rating => ({
        userId: rating.rater.id,
        userName: rating.rater.name,
        userEmail: rating.rater.email,
        submittedRating: rating.rating,
      })),
    };
  });

  res.json(dashboardData);
});

module.exports = {
  getStoreOwnerDashboard,
};