const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Cart = sequelize.define('Cart', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = Cart;
