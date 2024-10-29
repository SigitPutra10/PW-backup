const Users = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi pengguna
const verifyUser = async (req, res, next) => {
try {
        // Ambil token dari header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Mohon login ke akun Anda' });
        }

        // Verifikasi token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token tidak valid' });
            }

            // Cek apakah user ada di database
            const foundUser = await Users.findOne({
                where: { id: decoded.userId }  // Ambil userId dari token
            });
            if (!foundUser) {
                return res.status(404).json({ message: 'User tidak ditemukan' });
            }

            // Simpan userId dan role di req untuk digunakan di endpoint berikutnya
            req.userId = foundUser.id;
            req.role = foundUser.role;

            // Lanjut ke middleware berikutnya
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan server', error });
    }
}

// Middleware untuk akses admin
const adminOnly = (req, res, next) => {
    // Cek apakah role yang didapat dari middleware verifyUser adalah admin
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Akses terlarang" });
    }
    
    // Lanjut ke middleware berikutnya
    next();
}


// Middleware untuk otentikasi token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        console.log(user);
        req.user = user;
        next();
    });
};

module.exports = {
    verifyUser,
    adminOnly,
    authenticateToken
};
