// backend/models/index.js
const { sequelize } = require('../config/db');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// Define Associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'submittedRatings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'rater' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'storeRatings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'ratedStore' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` attempts to change the existing table in-place to match the model. Use `force: true` only in development to drop and re-create tables.
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncDatabase,
};