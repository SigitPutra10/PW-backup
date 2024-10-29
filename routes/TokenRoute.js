const express = require('express');
const { refreshToken } = require('../controllers/TokenController');

const router = express.Router();

router.post('/token', refreshToken); // Jalankan refreshToken ketika user meminta refresh

module.exports = router;
