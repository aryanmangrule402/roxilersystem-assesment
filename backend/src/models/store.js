// backend/models/store.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Store owner will be associated via a foreign key
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true, // A store might initially be created without an owner, or owner can be assigned later
    references: {
      model: 'Users', // 'Users' refers to table name
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = Store;