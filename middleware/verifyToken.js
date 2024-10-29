const jwt = require('jsonwebtoken');
const Users = require('../models/UserModel');

// Middleware untuk memeriksa dan menyegarkan access token otomatis
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                // Jika access token kadaluarsa, lakukan refresh token otomatis
                const refreshToken = req.body.refreshToken; // Refresh token bisa diambil dari request body atau header
                if (!refreshToken) return res.sendStatus(403);

                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if (err) return res.sendStatus(403);

                    // Buat access token baru
                    const newAccessToken = jwt.sign(
                        {
                            userId: user.userId,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' }
                    );

                    // Kirim access token baru ke client
                    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                    req.user = user;
                    next();
                });
            } else {
                return res.sendStatus(403);
            }
        } else {
            req.user = user;
            next();
        }
    });
};

module.exports = verifyToken;
