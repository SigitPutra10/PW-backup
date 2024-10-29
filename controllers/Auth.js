const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Users = require('../models/UserModel');

exports.Login = async (req, res) => {
    try {
        // Temukan pengguna berdasarkan email
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) 
            return res.status(404).json({ msg: "User tidak ditemukan" });

        // Verifikasi password
        const match = await argon2.verify(user.password, req.body.password);
        if (!match)
            return res.status(400).json({ msg: "Password Salah" });

        // Buat token JWT
        const userId = user.id; 
        const name = user.name;
        const email = user.email;
        const role = user.role;

        const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30m'
        });

        const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        req.session.userId = user.id; // Menyimpan ID pengguna di sesi

        res.status(200).json({ accessToken, refreshToken, role, name, userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

exports.Me = async (req, res) => {
    try {
        // Ambil token dari header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Ambil token dari "Bearer <token>"

        if (!token) return res.sendStatus(401); // Unauthorized jika token tidak ada

        // Verifikasi token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403); // Forbidden jika token tidak valid

            // Jika token valid, kirimkan data pengguna
            res.status(200).json({ 
                userId: user.userId, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            });
        });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

exports.Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err)
            return res.status(400).json({ msg: "tidak dapat logout" });
        res.status(200).json({ msg: "anda telah logout" });
    });
};
