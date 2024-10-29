const { where } = require('sequelize');
const Users = require('../models/UserModel');
const argon2 = require('argon2');

exports.getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            where: {
                role: 'user'
            },
            attributes: ['id', 'name', 'email', 'createdAt']
        });
        if (!response) return res.status(404).json({ msg: "User not found" });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['id', 'name', 'email', 'role'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword)
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.adminCreateUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword)
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!user) 
        return res.status(404).json({ msg: "User tidak ditemukan" });
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword)
        return res.status(400).json({ msg: "Password dan Confirm password tidak cocok" });
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Update Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!user) 
        return res.status(404).json({ msg: "User tidak ditemukan" });
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Delete Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
