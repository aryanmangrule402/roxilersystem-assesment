// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all registered stores (for normal user)
// @route   GET /api/users/stores
// @access  Private (Normal User)
const getAllStoresForUser = asyncHandler(async (req, res) => {
  const { name, address, sort_by = 'name', sort_order = 'ASC' } = req.query;
  const whereClause = {};

  if (name) {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }
  if (address) {
    whereClause.address = { [Op.iLike]: `%${address}%` };
  }

  const stores = await Store.findAll({
    where: whereClause,
    order: [[sort_by, sort_order]],
    include: [
      {
        model: Rating,
        as: 'storeRatings',
        attributes: ['rating', 'userId'],
        required: false, // Use required: false for LEFT JOIN
      },
    ],
  });

  const storesWithRatings = stores.map(store => {
    const totalRatings = store.storeRatings.length;
    const sumRatings = store.storeRatings.reduce((sum, r) => sum + r.rating, 0);
    const overallRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 'N/A';

    const userRating = store.storeRatings.find(r => r.userId === req.user.id);

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      email: store.email,
      overallRating,
      userSubmittedRating: userRating ? userRating.rating : null,
    };
  });

  res.json(storesWithRatings);
});

// @desc    Submit or modify a rating for a store
// @route   POST /api/users/stores/:storeId/ratings
// @access  Private (Normal User)
const submitOrModifyRating = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  const store = await Store.findByPk(storeId);
  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  let existingRating = await Rating.findOne({
    where: { userId, storeId },
  });

  if (existingRating) {
    existingRating.rating = rating;
    await existingRating.save();
    res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
  } else {
    const newRating = await Rating.create({
      userId,
      storeId,
      rating,
    });
    res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
  }
});

module.exports = {
  getAllStoresForUser,
  submitOrModifyRating,
};