// backend/config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries in console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is important for Aiven's self-signed certs. In production, you might want to configure proper CA certificates.
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };