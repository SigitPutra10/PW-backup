const jwt = require('jsonwebtoken');
const Users = require('../models/UserModel');

exports.refreshToken = (req, res) => {
    const refreshToken = req.body.refreshToken; // Ambil refresh token dari body
    if (!refreshToken) return res.sendStatus(401); // Jika tidak ada refresh token, kembalikan status 401

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Jika refresh token tidak valid atau expired, kembalikan status 403

        // Buat access token baru dengan informasi user yang sama
        const accessToken = jwt.sign(
            { 
                userId: user.userId, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken }); // Kirim access token baru sebagai respons
    });
};
