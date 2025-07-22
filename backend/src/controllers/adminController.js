// backend/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (System Administrator)
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();

  res.json({
    totalUsers,
    totalStores,
    totalRatings,
  });
});

// @desc    Add a new store
// @route   POST /api/admin/stores
// @access  Private (System Administrator)
const addStore = asyncHandler(async (req, res) => {
    const {
        name,          // Store name
        email,         // Store email
        address,       // Store address
        ownerName,     // New owner's name
        ownerEmail,    // New owner's email
        ownerPassword, // New owner's password
        ownerAddress   // New owner's address (optional depending on your User model)
    } = req.body;

    // 1. Basic validation for store details
    if (!name || !email || !address) {
        res.status(400);
        throw new Error('Please enter store name, email, and address.');
    }

    // 2. Basic validation for owner details
    if (!ownerName || !ownerEmail || !ownerPassword) {
        res.status(400);
        throw new Error('Please enter owner\'s name, email, and password.');
    }

    // 3. Check if store email already exists
    const storeExists = await Store.findOne({ where: { email } });
    if (storeExists) {
        res.status(400);
        throw new Error('Store with this email already exists');
    }

    // 4. Check if owner email already exists (important!)
    const ownerUserExists = await User.findOne({ where: { email: ownerEmail } });
    if (ownerUserExists) {
        res.status(400);
        throw new Error('A user with this owner email already exists. Please use a different email for the owner.');
    }

    // Use a transaction to ensure both user and store are created successfully
    const t = await sequelize.transaction();

    try {
        // 5. Create the new store_owner user
        const newOwner = await User.create({
            name: ownerName,
            email: ownerEmail,
            password: ownerPassword,
            address: ownerAddress, // Optional
            role: 'store_owner', // This is crucial: fixed role for the owner
        }, { transaction: t });

        // 6. Create the store, linking it to the new owner's ID
        const newStore = await Store.create({
            name,
            email,
            address,
            ownerId: newOwner.id, // Link the store to the newly created owner's ID
        }, { transaction: t });

        // Commit the transaction if both operations succeed
        await t.commit();

        res.status(201).json({
            message: 'Store and owner created successfully!',
            store: {
                id: newStore.id,
                name: newStore.name,
                email: newStore.email,
                address: newStore.address,
                ownerId: newStore.ownerId
            },
            owner: {
                id: newOwner.id,
                name: newOwner.name,
                email: newOwner.email,
                role: newOwner.role,
            }
        });

    } catch (error) {
        // Rollback the transaction if any error occurs
        await t.rollback();
        console.error('Error creating store and owner:', error);
        res.status(500); // Or 400 depending on the specific error type
        throw new Error('Failed to create store and owner. ' + error.message);
    }
});

// @desc    Add a new user (normal or admin)
// @route   POST /api/admin/users
// @access  Private (System Administrator)
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, role } = req.body; // Role will be provided by admin

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const newUser = await User.create({ name, email, password, address, role });
  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    address: newUser.address,
    role: newUser.role,
  });
});

// @desc    Get all users (normal and admin)
// @route   GET /api/admin/users
// @access  Private (System Administrator)
const getAllUsers = asyncHandler(async (req, res) => {
  const { name, email, address, role, sort_by = 'name', sort_order = 'ASC' } = req.query;
  const whereClause = {};

  if (name) {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }
  if (email) {
    whereClause.email = { [Op.iLike]: `%${email}%` };
  }
  if (address) {
    whereClause.address = { [Op.iLike]: `%${address}%` };
  }
  if (role) {
    whereClause.role = role;
  }

  const users = await User.findAll({
    where: whereClause,
    order: [[sort_by, sort_order]],
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Store,
        as: 'ownedStores',
        attributes: ['id', 'name', 'email', 'address'],
        required: false,
      },
    ],
  });

  res.json(users);
});

// @desc    Get all stores with average rating
// @route   GET /api/admin/stores
// @access  Private (System Administrator)
const getAllStores = asyncHandler(async (req, res) => {
  const { name, email, address, sort_by = 'name', sort_order = 'ASC' } = req.query;
  const whereClause = {};

  if (name) {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }
  if (email) {
    whereClause.email = { [Op.iLike]: `%${email}%` };
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
        attributes: ['rating'],
        required: false,
      },
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email'],
        required: false,
      }
    ],
  });

  const storesWithAvgRating = stores.map(store => {
    const totalRatings = store.storeRatings.length;
    const sumRatings = store.storeRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 'N/A';

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      owner: store.owner ? { id: store.owner.id, name: store.owner.name, email: store.owner.email } : null,
      averageRating,
    };
  });

  res.json(storesWithAvgRating);
});

module.exports = {
  getAdminDashboardStats,
  addStore,
  addUser,
  getAllUsers,
  getAllStores,
};