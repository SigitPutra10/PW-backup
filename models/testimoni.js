const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Users = require('./UserModel');

const Testimoni = sequelize.define('testimonis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Users,
            key: 'name'
        }
  },
  ulasan: {
    type: Sequelize.STRING
  },
  emote: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Users,
        key: 'id'
    }
  },
}, {
    freezeTableName: true
});

module.exports = Testimoni;