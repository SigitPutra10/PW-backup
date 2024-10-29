const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Orders = sequelize.define('Order', { // Ganti Order dengan Orders
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: { // Tambahkan kolom totalPrice
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
});

// Ekspor model dengan nama Orders
module.exports = Orders;
