const Orders = require('../models/OrderModel'); // Import model Order
const Invoices = require('../models/InvoiceModel'); // Import model Invoice
const Cart = require('../models/CartModel'); // Import model keranjang
const Products = require('../models/ProductModel'); // Import model produk
const sendInvoiceEmail = require('../utils/nodemailer');

const createOrderFromCart = async (req, res) => {
    console.log("User from request:", req.user); // Debugging log
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const customerEmail = req.user.email;

    try {
        // Ambil semua produk dari keranjang user
        const cartItems = await Cart.findAll({
            where: { userId: req.user.id },
            include: [{ model: Products }]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ msg: "Keranjang Anda kosong" });
        }

        // Hitung total harga
        const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.Product.price, 0);

        // Buat order baru
        const newOrder = await Orders.create({ // Ganti Order menjadi Orders
            userId: req.user.id,
            totalPrice: totalPrice,
            status: 'pending'
        });

        // Buat invoice terkait order tersebut
        const newInvoice = await Invoices.create({
            orderId: newOrder.id,
            customerEmail: customerEmail,
            totalPrice: totalPrice,
            status: 'pending'
        });

        // Hapus item dari keranjang setelah membuat order
        await Cart.destroy({ where: { userId: req.user.id } });

        // Kirim email
        await sendInvoiceEmail(customerEmail, `Invoice for Order #${newOrder.id}`, `Thank you for your purchase. Your total is $${totalPrice}`, `
            <h1>Invoice #${newOrder.id}</h1>
            <p>Thank you for your purchase!</p>
            <p>Your total is: $${totalPrice}</p>
            <h2>Order Details:</h2>
            <ul>${cartItems.map(item => `<li>${item.Product.name} - Quantity: ${item.quantity} - Subtotal: $${item.quantity * item.Product.price}</li>`).join("")}</ul>
        `);

        res.status(201).json({ message: 'Order created and email sent', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrderFromCart
};
