require('dotenv').config();

const Sequelize = require('sequelize');

const connection = new Sequelize('blog', 'root', 'FelipeMorel12', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00',
});

module.exports = connection;
