// models/Session.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/Database'); // Pastikan path ini benar

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  expires: {
    type: DataTypes.DATE
  },
  data: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Sessions',
  timestamps: false
});

module.exports = Session;
