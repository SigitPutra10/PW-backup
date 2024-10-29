const { where } = require('sequelize')
const Testimoni = require('../models/testimoni')
const Users = require('../models/UserModel');

exports.getTestimoni = async (req, res ) => {
    try {
        const cartItems = await Testimoni.findAll({
            where: {
                userId: req.userId
            }
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createTestimoni = async (req, res) => {
    const { ulasan, emote } = req.body;
    const userId = req.userId;
    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }
        
        await Testimoni.create({
            name:  user.name,
            ulasan: ulasan,
            emote: emote,
            userId: userId
        });
        res.status(200).json({msg: "Testimoni terkirim"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

exports.updateTestimoni = async (req, res) => {
    console.log(req.params.id);
    try {
        const testimoni = await Testimoni.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!testimoni)
            return res.status(500).json({msg: 'Data tidak ditemukan'});
        
        const { ulasan, emote } = req.body;

        await Testimoni.update({
            ulasan,
            emote
        },{
            where: {
            id: testimoni.id
            }
        });
        res.status(200).json({msg: "berhasil update testimoni"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

exports.deleteTestimoni = async (req, res) => {
    try {
        const testimoni = await Testimoni.findOne({
            where: {
                id: req.params.id
            }
        });

        if(!testimoni)
            return res.status(500).json({msg: 'Data tidak ditemukan'})

        await Testimoni.destroy({
            where: {
                id: testimoni.id
            }
        });
        res.status(200).json({msg: "berhasil hapus testimoni"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}