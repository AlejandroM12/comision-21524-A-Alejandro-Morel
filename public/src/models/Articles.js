const Sequelize = require('sequelize');
const connection = require('../config/database');
const Category = require('./Category');

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
});

Category.hasMany(Article);
Article.belongsTo(Category);

module.exports = Article;
