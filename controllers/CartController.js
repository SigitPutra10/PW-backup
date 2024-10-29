const Cart = require('../models/CartModel');
const Products = require('../models/ProductModel');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Products.findOne({
            where: {
                id: productId
            }
        });

        if (!product) {
            return res.status(404).json({ msg: "Produk tidak ditemukan" });
        }

        const existingCartItem = await Cart.findOne({
            where: {
                productId: productId,
                userId: req.userId
            }
        });

        if (existingCartItem) {
            await Cart.update({ quantity: existingCartItem.quantity + quantity }, {
                where: {
                    id: existingCartItem.id
                }
            });
        } else {
            await Cart.create({
                productId: productId,
                quantity: quantity,
                userId: req.userId
            });
        }

        res.status(201).json({ msg: "Produk berhasil ditambahkan ke keranjang" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: {
                userId: req.userId
            }
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Cart.destroy({
            where: {
                id: id,
                userId: req.userId
            }
        });

        if (result === 0) {
            return res.status(404).json({ msg: "Item di keranjang tidak ditemukan" });
        }

        res.status(200).json({ msg: "Item di keranjang berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
