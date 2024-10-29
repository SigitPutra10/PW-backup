const Cart = require('./models/CartModel');
const Product = require('./models/ProductModel');
const User = require('./models/UserModel');

// Define associations
Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Cart, Product, User };