const Products = require('../models/ProductModel');

exports.getProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        const productsWithImages = products.map(product => {
            // Periksa apakah product.image sudah mengandung URL lengkap
            const isFullUrl = product.image.startsWith(`${req.protocol}://${req.get('host')}/uploads/`);

            return {
                ...product.toJSON(),
                image: product.image 
                    ? (isFullUrl ? product.image : `${req.protocol}://${req.get('host')}/uploads/${product.image}`)
                    : null
            };
        });
        res.status(200).json(productsWithImages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product)
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; // URL gambar lengkap

    try {
        await Products.create({
            name,
            price,
            image,
            description
        });
        res.status(201).json({ msg: "Berhasil tambah Produk", image });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { name, price, description } = req.body;
        const image = req.file ? req.file.filename : product.image; // Ambil gambar baru atau gunakan gambar lama

        // Hapus gambar lama jika ada gambar baru di-upload
        if (req.file && product.image) {
            fs.unlinkSync(`./uploads/${product.image}`);
        }

        await Products.update({ name, price, image, description }, {
            where: {
                id: product.id
            }
        });
        res.status(200).json({ msg: "Berhasil update produk" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product)
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { name, price } = req.body;
        await Products.destroy({
            where: {
                id: product.id
            }
        });
        res.status(200).json({ msg: "Berhasil hapus produk" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
