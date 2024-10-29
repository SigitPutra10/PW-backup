const express = require('express');
const { addToCart, getCart, deleteCartItem } = require('../controllers/CartController');
const { verifyUser } = require('../middleware/AuthUser');

const router = express.Router();

router.post('/cart/add', verifyUser, addToCart);
router.get('/cart', verifyUser, getCart);
router.delete('/cart/:id', verifyUser, deleteCartItem);

module.exports = router;
