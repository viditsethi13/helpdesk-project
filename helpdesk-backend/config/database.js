const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // In-memory for Vercel
  logging: false,
});

module.exports = sequelize;
