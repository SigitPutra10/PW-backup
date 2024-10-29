const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Orders = require('./OrderModel');

class Invoices extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Orders,
                    key: 'id'
                }
            },
            customerEmail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            totalPrice: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'pending'
            }
        }, {
            sequelize,
            freezeTableName: true,
            modelName: 'invoices'
        });
    }
}

module.exports = Invoices;
