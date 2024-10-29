// orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrderFromCart } = require('../controllers/orderController'); 
const { authenticateToken } = require('../middleware/AuthUser'); // Ubah ini menjadi authenticateToken

// Gunakan authenticateToken di sini
router.post('/from-cart', authenticateToken, createOrderFromCart); 

module.exports = router;