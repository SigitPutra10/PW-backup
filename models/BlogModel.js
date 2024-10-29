const { DataTypes } = require('sequelize');
const Sequelize = require('../config/Database.js');

const Blog = Sequelize.define('blogs', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
}, {
  freezeTableName: true
});

module.exports = Blog;
